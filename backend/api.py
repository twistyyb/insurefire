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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database client
db = SupaDB()

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

if __name__ == '__main__':
    logging.info("=== API SERVER STARTING ===")
    app.run(host='0.0.0.0', port=8080, debug=True)
