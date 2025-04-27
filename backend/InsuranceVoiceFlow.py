"""
Embers Voice Flow Integration

This module connects the YOLO object detection, Gemini valuation, and ElevenLabs voice agent
to create a seamless end-to-end experience for users.

Usage:
    python InsuranceVoiceFlow.py <video_url>
"""

import sys
import os
import uuid
from dotenv import load_dotenv
from app import process_video
from supaDB import SupaDB
from VoiceAgent import VoiceAgent

# Load environment variables
load_dotenv()

def main():
    """Main function to run the end-to-end flow"""
    if len(sys.argv) < 2:
        print("Usage: python InsuranceVoiceFlow.py <video_url>")
        return
    
    # Get video URL from command line
    video_url = sys.argv[1]
    print(f"Processing video: {video_url}")
    
    # Initialize Supabase client
    db = SupaDB()
    
    # Create job in database
    job_id = db.create_empty_job()
    print(f"Created job in database with ID: {job_id}")
    
    try:
        # Process video with YOLO (this will detect objects and upload to Supabase)
        print("Starting video processing with YOLO...")
        process_video(video_url, job_id, db)
        print("Video processing complete!")
        
        # Get processed items from database
        print("Retrieving detected items from database...")
        job_data = db.get_job_by_id(job_id)
        
        if not job_data:
            print("Error: Could not retrieve job data from database")
            return
            
        # Extract item metadata
        item_metadata = job_data.get('result', {})
        print(f"Retrieved {len(item_metadata)} items from database")
        
        # Start voice agent conversation
        print("\n===== Starting Voice Agent Conversation =====")
        print("The voice agent will help gather more details about detected items")
        print("and provide personalized insurance recommendations.")
        print("Speak clearly and answer the questions to get the most accurate valuation.")
        print("==============================================\n")
        
        agent = VoiceAgent(item_metadata)
        agent.start_conversation()
        
        # After conversation, get refined valuations
        refined_valuations = agent.get_refined_valuations()
        
        # Get insurance recommendations
        insurance_recommendations = agent.get_insurance_recommendations()
        
        # Print summary
        print("\n===== Summary =====")
        print("Original Valuations:")
        total_original = 0
        for item_id, item_data in item_metadata.items():
            item_class = item_data.get('class', 'unknown')
            value = item_data.get('estimated_price', 0)
            total_original += value
            print(f"- {item_class}: ${value:.2f}")
        print(f"Total Original Value: ${total_original:.2f}")
        
        print("\nRefined Valuations:")
        total_refined = 0
        for item_id, valuation in refined_valuations.items():
            item_class = item_metadata[item_id].get('class', 'unknown')
            value = valuation['refined_value']
            total_refined += value
            print(f"- {item_class}: ${value:.2f}")
        print(f"Total Refined Value: ${total_refined:.2f}")
        
        print("\nInsurance Recommendations:")
        print(f"- Recommended Coverage Type: {insurance_recommendations['coverage_type']}")
        
        if insurance_recommendations['special_riders']:
            print("- Special Riders Needed:")
            for rider in insurance_recommendations['special_riders']:
                print(f"  * {rider}")
        
        print("- Documentation Recommendations:")
        for doc in insurance_recommendations['documentation']:
            print(f"  * {doc}")
            
        print("- Fire Protection Recommendations:")
        for protection in insurance_recommendations['fire_protection']:
            print(f"  * {protection}")
            
        # Update database with refined valuations and recommendations
        print("\nUpdating Supabase with refined valuations and recommendations...")
        update_result = db.update_job_result(job_id, {
            'refined_valuations': refined_valuations,
            'insurance_recommendations': insurance_recommendations
        })
        
        if update_result:
            print("Successfully updated Supabase with new valuations!")
        else:
            print("Warning: Failed to update Supabase with new valuations.")
            
        print("\nThank you for using Embers!")
        
    except Exception as e:
        print(f"Error in voice flow: {str(e)}")
        db.update_job_status(job_id, 'failed')

if __name__ == "__main__":
    main()
