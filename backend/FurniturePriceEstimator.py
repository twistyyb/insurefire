import os
import base64
import google.generativeai as genai
import tkinter as tk
from tkinter import filedialog, Label, Button, Text, END, WORD
from PIL import Image, ImageTk
import io

# Setup API key - you would need to get your own Gemini API key
GEMINI_API_KEY = "AIzaSyDAuu0GAm8Rr_qyHdNlAqRZQuBnC2KwiNI"
genai.configure(api_key=GEMINI_API_KEY)

class FurniturePriceEstimator:
    def __init__(self, root):
        self.root = root
        self.root.title("Furniture Price Estimator")
        self.root.geometry("800x600")
        
        # Setup UI
        self.setup_ui()
        
        # Initialize Gemini model
        self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
        
    def setup_ui(self):
        # Image display area
        self.image_label = Label(self.root)
        self.image_label.pack(pady=10)
        
        # Upload button
        self.upload_btn = Button(self.root, text="Upload Furniture Image", command=self.upload_image)
        self.upload_btn.pack(pady=5)
        
        # Estimate button
        self.estimate_btn = Button(self.root, text="Estimate Price", command=self.estimate_price)
        self.estimate_btn.pack(pady=5)
        self.estimate_btn.config(state="disabled")  # Disabled until image is uploaded
        
        # Results text area
        self.result_text = Text(self.root, height=15, width=80, wrap=WORD)
        self.result_text.pack(pady=10)
    
    def upload_image(self):
        # Open file dialog to select image
        file_path = filedialog.askopenfilename(
            filetypes=[("Image files", "*.jpg *.jpeg *.png")]
        )
        
        if file_path:
            # Store the file path
            self.current_image_path = file_path
            
            # Display the image
            self.display_image(file_path)
            
            # Enable the estimate button
            self.estimate_btn.config(state="normal")
            
            # Clear previous results
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, f"Image loaded: {os.path.basename(file_path)}\n")
            self.result_text.insert(END, "Click 'Estimate Price' to analyze the furniture.")
    
    def display_image(self, file_path):
        # Open and resize image for display
        img = Image.open(file_path)
        # Resize while maintaining aspect ratio
        img.thumbnail((400, 400))
        photo_img = ImageTk.PhotoImage(img)
        
        # Update image in label
        self.image_label.config(image=photo_img)
        self.image_label.image = photo_img  # Keep a reference
    
    def estimate_price(self):
        if not hasattr(self, 'current_image_path'):
            return
            
        # Show loading message
        self.result_text.delete(1.0, END)
        self.result_text.insert(END, "Analyzing furniture... Please wait.\n\n")
        self.root.update()
        
        try:
            # Process image with Gemini
            response = self.analyze_item_with_gemini()
            
            # Display results
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, response)
        except Exception as e:
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, f"Error analyzing image: {str(e)}")
    
    def analyze_item_with_gemini(self):
        # Prepare the image
        image = Image.open(self.current_image_path)
        
        # Prepare prompt for Gemini
        prompt = """
        Please analyze this furniture item and provide the following information in this exact format:

        PRICE: [Provide a single estimated price in USD]

        DETAILED ANALYSIS:
        1. What type of furniture is this?
        2. Describe its style, materials, and condition
        3. Explain the factors that influence your price estimation
        
        Format your response in a clear, organized manner.
        """

        prompt2 = """
        Please analyze this item, estimate its price and and produce a single, number value between 1 and 1000000.
        Analyze the object, and decide a very short name for it 
        Your response should be a list of two values in the format of ["name of object", price] exactly.
        """
        
        # Get response from Gemini
        response = self.model.generate_content([prompt, image])
        
        return response.text

if __name__ == "__main__":
    root = tk.Tk()
    app = FurniturePriceEstimator(root)
    root.mainloop()