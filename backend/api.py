from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
import json
import logging
from datetime import datetime
from app import process_video  # Import your main processing function
from supaDB import SupaDB
import threading
import time
import base64
from VoiceAgent import VoiceAgent
import wave

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all routes with more specific configuration

# Initialize database client
db = SupaDB()

# Voice agent cache - store instances by job_id
voice_agents = {}

# Create frames directory if it doesn't exist
FRAMES_DIR = os.path.join(os.path.dirname(__file__), 'frames')
os.makedirs(FRAMES_DIR, exist_ok=True)

# Global variable to track the latest frame
latest_frame_path = None
frame_lock = threading.Lock()

@app.route('/api/latest-frame', methods=['GET'])
def get_latest_frame():
    frame_path = os.path.join(FRAMES_DIR, 'displayFrame.jpg')
    if os.path.exists(frame_path):
        return send_file(frame_path, mimetype='image/jpeg')
    return jsonify({'error': 'No frame available'}), 404

@app.route('/api/create-job', methods=['POST'])
def create_job():
    logging.info("=== CREATE JOB API CALLED ===")
    try:
        logging.info("Creating new job in database...")
        job_id = db.create_empty_job()
        logging.info(f"Job created successfully with ID: {job_id}")
        
        return jsonify({
            'status': 'success',
            'job_id': job_id
        })
    except Exception as e:
        logging.error(f"Error creating job: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/process-video', methods=['POST'])
def handle_video_processing():
    logging.info("=== PROCESS VIDEO API CALLED ===")
    try:
        data = request.get_json()
        video_url = data.get('fileUrl')
        job_id = data.get('job_id')
        show_display = data.get('show_display', False)  # Default to False if not specified

        db.update_video_address(job_id, video_url)
        
        logging.info(f"Processing request for job_id: {job_id}")
        logging.info(f"Video URL: {video_url}")
        logging.info(f"Show display: {show_display}")
        
        if not video_url or not job_id:
            logging.error("Missing required parameters in request")
            return jsonify({
                'error': 'Missing required parameters',
                'status': 'error'
            }), 400

        logging.info("Updating job status to 'processing'...")
        db.update_job_status(job_id, 'processing')
        
        try:
            logging.info("Starting video processing...")
            process_video(video_url, job_id, db, show_display)

            logging.info("Processing completed successfully")
            return jsonify({
                'status': 'success',
                'job_id': job_id
            })
            
        except Exception as processing_error:
            logging.error(f"Error during video processing: {str(processing_error)}")
            logging.info("Updating job status to 'failed'...")
            db.update_job_status(job_id, 'failed')
            raise processing_error

    except Exception as e:
        logging.error(f"Unexpected error in process-video endpoint: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/job/<job_id>', methods=['GET'])
def get_job_status(job_id):
    logging.info(f"=== GET JOB STATUS API CALLED for job_id: {job_id} ===")
    try:
        logging.info(f"Fetching job data for job_id: {job_id}")
        job_data = db.get_job_by_id(job_id)
        
        if not job_data:
            logging.warning(f"Job not found for job_id: {job_id}")
            return jsonify({
                'error': 'Job not found',
                'status': 'error'
            }), 404
            
        logging.info(f"Job data retrieved successfully: {json.dumps(job_data, indent=2)}")
        return jsonify({
            'status': 'success',
            'job': job_data
        })
        
    except Exception as e:
        logging.error(f"Error fetching job status: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/voice/initialize/<job_id>', methods=['GET'])
def initialize_voice_agent(job_id):
    """Initialize a voice agent for a specific job"""
    try:
        # Get job data from database
        job_data = db.get_job_by_id(job_id)
        
        if not job_data:
            return jsonify({'error': 'Job not found'}), 404
            
        # Extract item metadata from result
        item_metadata = job_data.get('result', {})
        
        # Create a new voice agent instance
        voice_agents[job_id] = VoiceAgent(item_metadata)
        
        # Get welcome message
        welcome_message = voice_agents[job_id]._generate_welcome_message()
        
        return jsonify({
            'status': 'success',
            'message': welcome_message,
            'item_count': len(item_metadata),
            'total_value': sum(item.get("estimated_price", 0) for item in item_metadata.values() if item.get("estimated_price") is not None)
        })
        
    except Exception as e:
        logging.error(f"Error initializing voice agent: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/voice/process', methods=['POST'])
def process_voice_input():
    """Process voice input from the user"""
    try:
        data = request.get_json()
        job_id = data.get('job_id')
        audio_data = data.get('audio')  # Base64 encoded audio
        
        if not job_id or not audio_data:
            return jsonify({'error': 'Missing required parameters'}), 400
            
        # Get the voice agent for this job
        voice_agent = voice_agents.get(job_id)
        if not voice_agent:
            # Initialize voice agent if not already in cache
            job_data = db.get_job_by_id(job_id)
            if not job_data:
                return jsonify({'error': 'Job not found'}), 404
                
            # Extract item metadata from result (not metadata)
            item_metadata = job_data.get('result', {})
            voice_agents[job_id] = VoiceAgent(item_metadata)
            voice_agent = voice_agents[job_id]
            
        # Decode audio data
        try:
            # Handle data URLs (e.g., "data:audio/webm;base64,...")
            if ',' in audio_data:
                audio_data = audio_data.split(',', 1)[1]
            audio_bytes = base64.b64decode(audio_data)
        except Exception as e:
            logging.error(f"Error decoding audio data: {str(e)}")
            return jsonify({'error': 'Invalid audio data format'}), 400
        
        # Save to temporary file
        temp_audio_file = "temp_user_input.wav"
        with open(temp_audio_file, 'wb') as f:
            f.write(audio_bytes)
            
        # Transcribe audio
        transcription = voice_agent._transcribe_audio(temp_audio_file)
        
        if not transcription:
            return jsonify({'error': 'Failed to transcribe audio'}), 500
            
        # Process user input
        voice_agent._add_to_history("user", transcription)
        response = voice_agent._process_user_input(transcription)
        voice_agent._add_to_history("assistant", response)
        
        # Generate speech
        speech_file = voice_agent._speak(response)
        
        # Check if speech file was created successfully
        if not speech_file or not os.path.exists(speech_file):
            return jsonify({
                'status': 'error',
                'error': 'Failed to generate speech'
            }), 500
        
        # Read speech file and encode as base64
        with open(speech_file, 'rb') as f:
            speech_data = base64.b64encode(f.read()).decode('utf-8')
            
        # Clean up temporary files after reading the file
        if os.path.exists(speech_file):
            os.remove(speech_file)
        
        return jsonify({
            'status': 'success',
            'transcription': transcription,
            'response': response,
            'speech': f"data:audio/mp3;base64,{speech_data}",
            'conversation_history': voice_agent.conversation_history
        })
        
    except Exception as e:
        logging.error(f"Error processing voice input: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logging.info("=== API SERVER STARTING ===")
    app.run(host='0.0.0.0', port=8080, debug=True)
