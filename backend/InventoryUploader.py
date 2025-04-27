import os
import json
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(
    SUPABASE_URL, 
    SUPABASE_KEY
)

class InventoryUploader:
    def __init__(self):
        # Initialize with default user ID (can be customized later)
        self.user_id = "66274d9c-6ece-4eeb-a8ed-19051a8a2103"  # Default user ID
    
    def set_user_id(self, user_id):
        """Set a custom user ID for the upload"""
        self.user_id = user_id
    
    def test_supabase_connection(self):
        """
        Test connection to Supabase
        
        Returns:
            bool: True if connection is successful, False otherwise
        """
        try:
            print("Testing Supabase connection...")
            # Try to get a single row from any table to test connection
            test_response = supabase.from_('job').select('id').limit(1).execute()
            print(f"Connection successful: {test_response}")
            return True
        except Exception as e:
            print(f"Supabase connection error: {str(e)}")
            print("Please check your Supabase credentials and internet connection.")
            return False
    
    def upload_inventory(self, metadata_path, video_path=None):
        """
        Upload inventory data to Supabase
        
        Args:
            metadata_path: Path to the JSON metadata file
            video_path: Optional path to the source video or public URL from file_uploads table
        
        Returns:
            dict: Response from Supabase with inventory_id
        """
        # Test connection first
        if not self.test_supabase_connection():
            print("Cannot proceed with upload due to connection issues.")
            return None
            
        try:
            # Load metadata from JSON file
            with open(metadata_path, 'r') as f:
                inventory_data = json.load(f)
            
            # Create inventory record
            timestamp = datetime.now().isoformat()
            
            # Get video address - this should be a public URL from file_uploads table
            # If it's a local path, we'll just use the filename as a reference
            if video_path and video_path.startswith(('http://', 'https://')):
                # It's already a URL
                video_address = video_path
            else:
                # Try to find the public URL for this file in the file_uploads table
                try:
                    filename = os.path.basename(video_path) if video_path else ""
                    if filename:
                        print(f"Looking up public URL for file: {filename}")
                        file_response = supabase.from_('file_uploads').select('public_url').eq('original_name', filename).limit(1).execute()
                        if hasattr(file_response, 'data') and file_response.data:
                            video_address = file_response.data[0].get('public_url')
                            print(f"Found public URL: {video_address}")
                        else:
                            video_address = filename
                            print(f"No public URL found, using filename as reference: {video_address}")
                    else:
                        video_address = ""
                except Exception as lookup_error:
                    print(f"Error looking up file URL: {str(lookup_error)}")
                    video_address = os.path.basename(video_path) if video_path else ""
            
            # Calculate total value and item count
            total_value = 0
            item_count = 0
            
            for item_id, item_data in inventory_data.items():
                if item_data.get("estimated_price") is not None:
                    total_value += item_data["estimated_price"]
                item_count += 1
            
            # Print debug info
            print(f"Preparing to upload to Supabase:")
            print(f"- Table: job")
            print(f"- Video address: {video_address}")
            print(f"- Total value: {total_value}")
            print(f"- Item count: {item_count}")
            
            # Try the most minimal data first
            print("Attempting with minimal data...")
            try:
                minimal_response = supabase.from_('job').insert({
                    'created_at': timestamp,
                    'videoAddress': str(video_address) if video_address else "",
                    'result': {},
                    'total value': float(total_value),
                    'numItems': int(item_count)
                }).execute()
                
                print(f"Minimal upload response: {minimal_response}")
                
                if hasattr(minimal_response, 'data') and minimal_response.data:
                    inventory_id = minimal_response.data[0].get('id')
                    print(f"Minimal inventory uploaded successfully with ID: {inventory_id}")
                    
                    # Now try to update with the full data
                    print("Updating with full data...")
                    update_response = supabase.from_('job').update({
                        'result': inventory_data
                    }).eq('id', inventory_id).execute()
                    
                    print(f"Update response: {update_response}")
                    return minimal_response.data[0]
                else:
                    print(f"Error with minimal upload: {minimal_response}")
            except Exception as minimal_error:
                print(f"Error with minimal upload: {str(minimal_error)}")
                print("Trying alternative approach...")
                
                # Try with direct table access
                try:
                    print("Using direct table access...")
                    direct_response = supabase.table('job').insert({
                        'created_at': timestamp,
                        'videoAddress': str(video_address) if video_address else "",
                        'total value': float(total_value),
                        'numItems': int(item_count)
                    }).execute()
                    
                    print(f"Direct table response: {direct_response}")
                    
                    if hasattr(direct_response, 'data') and direct_response.data:
                        return direct_response.data[0]
                except Exception as direct_error:
                    print(f"Direct table error: {str(direct_error)}")
            
            return None
                
        except Exception as e:
            print(f"Error uploading inventory: {str(e)}")
            import traceback
            traceback.print_exc()
            return None

# Example usage:
# uploader = InventoryUploader()
# uploader.upload_inventory("item_snapshots/item_metadata.json", "source_video.mp4")
