import os
import base64
import google.generativeai as genai
import tkinter as tk
from tkinter import filedialog, Label, Button, Text, END, WORD
from PIL import Image, ImageTk
import io
import ast

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
        
        # Store images
        self.current_image_path = None
        self.current_images = []
        
    def setup_ui(self):
        # Image display area
        self.image_label = Label(self.root)
        self.image_label.pack(pady=10)
        
        # Upload button
        self.upload_btn = Button(self.root, text="Upload Furniture Image(s)", command=self.upload_images)
        self.upload_btn.pack(pady=5)
        
        # Estimate button
        self.estimate_btn = Button(self.root, text="Estimate Price", command=self.estimate_price)
        self.estimate_btn.pack(pady=5)
        self.estimate_btn.config(state="disabled")  # Disabled until image is uploaded
        
        # Results text area
        self.result_text = Text(self.root, height=15, width=80, wrap=WORD)
        self.result_text.pack(pady=10)
    
    def upload_images(self):
        # Open file dialog to select multiple images
        file_paths = filedialog.askopenfilenames(
            filetypes=[("Image files", "*.jpg *.jpeg *.png")]
        )
        
        if file_paths:
            # Store the file paths
            self.current_images = list(file_paths)
            self.current_image_path = file_paths[0]  # Set current image for display
            
            # Display the first image
            self.display_image(self.current_image_path)
            
            # Enable the estimate button
            self.estimate_btn.config(state="normal")
            
            # Clear previous results
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, f"Loaded {len(file_paths)} images:\n")
            for path in file_paths:
                self.result_text.insert(END, f"- {os.path.basename(path)}\n")
            self.result_text.insert(END, "\nClick 'Estimate Price' to analyze the items.")
    
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
        if not self.current_images:
            return
            
        # Show loading message
        self.result_text.delete(1.0, END)
        self.result_text.insert(END, "Analyzing items... Please wait.\n\n")
        self.root.update()
        
        try:
            if len(self.current_images) == 1:
                # Single image analysis
                response = self.analyze_item_with_gemini(self.current_images[0])
                print(response)
                self.result_text.delete(1.0, END)
                self.result_text.insert(END, response)
            else:
                # Multiple image analysis
                self.estimate_total_prices()
        except Exception as e:
            self.result_text.delete(1.0, END)
            self.result_text.insert(END, f"Error analyzing images: {str(e)}")
    
    def estimate_total_prices(self):
        total_price = 0
        items = []
        
        # Process each image
        for image_path in self.current_images:
            try:
                name, price = self.analyze_item_with_gemini(image_path)
                items.append((name, price))
                total_price += price
            except Exception as e:
                print(f"Error processing {image_path}: {str(e)}")
        
        # Display results
        self.result_text.delete(1.0, END)
        
        for name, price in items:
            self.result_text.insert(END, f"{name}: ${price}\n")
        
        self.result_text.insert(END, "\n=== TOTAL ===\n")
        self.result_text.insert(END, f"Total Estimated Value: ${total_price:,.2f}\n")


    
    # Returns a tuple of (name, price)
    def analyze_item_with_gemini(self, image_path):
        # Prepare the image
        image = Image.open(image_path)
        
        prompt2 = """
        Please analyze this item, estimate its price and and produce a single, number value between 1 and 1000000.
        Analyze the object, and decide a very short name for it.
        Your response should be a list of two values in the format of ["name of object", price] exactly.
        Only output the list, nothing else, do not include any other text or comments.
        The object should be a common household item, if it is not, be safe and return the name, but set the price to 0.
        """
        
        # Get response from Gemini
        response = self.model.generate_content([prompt2, image])
        
        try:
            # Parse the response into a tuple
            result = ast.literal_eval(response.text)
            if isinstance(result, list) and len(result) == 2:
                return (result[0], int(result[1]))
            else:
                raise ValueError("Invalid response format")
        except (ValueError, SyntaxError) as e:
            raise ValueError(f"Could not parse response: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = FurniturePriceEstimator(root)
    root.mainloop()