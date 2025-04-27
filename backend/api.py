from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import json
from app import process_video  # Import your main processing function

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/process-video', methods=['POST'])
def handle_video_processing():
    try:
        # Get the video URL from the request
        data = request.get_json()
        video_url = data.get('fileUrl')
        
        if not video_url:
            return jsonify({
                'error': 'No video URL provided',
                'status': 'error'
            }), 400

        # Process the video using your main app function
        results = process_video(video_url)
        
        # Return the results
        return jsonify({
            'status': 'success',
            'results': results
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
