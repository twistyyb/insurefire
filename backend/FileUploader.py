import os
import tkinter as tk
from tkinter import filedialog, Label, Button, Text, END, WORD
from PIL import Image, ImageTk
import uuid
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Please check your .env file.")

supabase: Client = create_client(
    SUPABASE_URL, 
    SUPABASE_KEY
)

class FileUploader:
    def __init__(self, root):
        self.root = root
        self.root.title("Photo Uploader")
        self.root.geometry("800x600")
        
        # Initialize variables
        self.current_file_path = None
        self.bucket_name = "file-uploads"
        self.user_id = "66274d9c-6ece-4eeb-a8ed-19051a8a2103"  # Placeholder user ID
        
        # Setup UI
        self.setup_ui() 
        
    def setup_ui(self):
        # File display area
        self.file_label = Label(self.root)
        self.file_label.pack(pady=10)
        
        # Upload button
        self.upload_btn = Button(self.root, text="Select Photo", command=self.select_file)
        self.upload_btn.pack(pady=5)
        
        # Submit button
        self.submit_btn = Button(self.root, text="Upload to Supabase", command=self.upload_to_supabase)
        self.submit_btn.pack(pady=5)
        self.submit_btn.config(state="disabled")  # Disabled until file is selected
        
        # Results text area
        self.result_text = Text(self.root, height=15, width=80, wrap=WORD)
        self.result_text.pack(pady=10)
    
    def select_file(self):
        # Open file dialog for image files
        filetypes = [("Image files", "*.jpg *.jpeg *.png")]
        file_path = filedialog.askopenfilename(filetypes=filetypes)
        
        if file_path:
            self.current_file_path = file_path
            self.display_image(file_path)
            
            # Enable the submit button
            self.submit_btn.config(state="normal")
            
            # Clear previous results
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, f"Selected file: {os.path.basename(file_path)}\n")
    
    def display_image(self, file_path):
        # Open and resize image for display
        img = Image.open(file_path)
        # Resize while maintaining aspect ratio
        img.thumbnail((400, 400))
        photo_img = ImageTk.PhotoImage(img)
        
        # Update image in label
        self.file_label.config(image=photo_img)
        self.file_label.image = photo_img  # Keep a reference
    
    def upload_to_supabase(self):
        if not self.current_file_path:
            print("No file selected for upload")
            return
            
        try:
            print(f"Starting upload process...")
            print(f"File path: {self.current_file_path}")
            
            # Show loading message
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, "Uploading file... Please wait.\n")
            self.root.update()
            
            # Read the file
            with open(self.current_file_path, 'rb') as f:
                file_data = f.read()
            print(f"File size: {len(file_data)} bytes")
            
            # Generate unique file name
            file_ext = os.path.splitext(self.current_file_path)[1]
            unique_prefix = f"{int(datetime.now().timestamp())}-{uuid.uuid4().hex[:7]}"
            sanitized_filename = os.path.basename(self.current_file_path).replace(' ', '_')
            unique_filename = f"{unique_prefix}-{sanitized_filename}"
            print(f"Generated unique filename: {unique_filename}")
            
            # Create safe path structure
            formatted_date = datetime.now().strftime("%Y%m%d")
            file_path = f"{formatted_date}/{unique_filename}"
            print(f"Attempting to upload to path: {file_path}")
            
            # Upload to Supabase Storage
            try:
                storage_response = supabase.storage.from_(self.bucket_name).upload(
                    file_path,
                    file_data,
                    {
                        "cache-control": "3600",
                        "content-type": self.get_mime_type(file_ext)
                    }
                )
                print("storage_response", storage_response)
                return
                print("File uploaded to storage successfully")
            except Exception as e:
                print(f"Storage upload error: {str(e)}")
                raise Exception(f"Storage upload error: {str(e)}")
            
            # Get the public URL for the file
            public_url = supabase.storage.from_(self.bucket_name).get_public_url(file_path)
            print(f"Generated public URL: {public_url}")
            
            # Save file metadata to database
            print("Attempting to insert into file_uploads table...")
            try:
                table_response = supabase.table('file_uploads').insert({
                    'user_id': self.user_id,
                    'file_name': unique_filename,
                    'original_name': os.path.basename(self.current_file_path),
                    'file_size': os.path.getsize(self.current_file_path),
                    'file_type': self.get_mime_type(file_ext),
                    'file_path': file_path,
                    'public_url': public_url,
                    'data_type': 'photo'
                }).execute()
                print("Successfully inserted into file_uploads table")
            except Exception as e:
                print(f"Database error: {str(e)}")
                raise Exception(f"Database error: {str(e)}")
            
            # Show success message
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, "File uploaded successfully!\n")
            self.result_text.insert(END, f"Public URL: {public_url}\n")
            
            # Reset UI
            self.current_file_path = None
            self.file_label.config(image='', text='')
            self.submit_btn.config(state="disabled")
            
        except Exception as e:
            print(f"Exception occurred: {str(e)}")
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, f"Error uploading file: {str(e)}\n")
    
    def get_mime_type(self, file_ext):
        mime_types = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png'
        }
        return mime_types.get(file_ext.lower(), 'image/jpeg')

if __name__ == "__main__":
    root = tk.Tk()
    app = FileUploader(root)
    root.mainloop() 