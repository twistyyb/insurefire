import os
import base64
import google.generativeai as genai
from PIL import Image
import io
import ast

# Setup API key - you would need to get your own Gemini API key
GEMINI_API_KEY = "AIzaSyDAuu0GAm8Rr_qyHdNlAqRZQuBnC2KwiNI"
genai.configure(api_key=GEMINI_API_KEY)

class FurniturePriceEstimator:
    def __init__(self):
        # Initialize Gemini model
        self.model = genai.GenerativeModel('gemini-2.0-flash-lite')

    def analyze_item_with_gemini(self, image_data):
        """
        Analyzes an image of furniture and returns a tuple of (name, price).
        
        Args:
            image_data: Either a bytes object containing image data or a PIL Image object
            
        Returns:
            tuple: (name: str, price: int)
        """
        # Convert image data to PIL Image
        if isinstance(image_data, bytes):
            image = Image.open(io.BytesIO(image_data))
        else:
            image = image_data  # Assume it's already a PIL Image
        
        prompt = """
        Please analyze this item, make a conservative estimate of its price and and produce a single, number value between 1 and 1000000.
        If ever questioning the quality of the image or the premiumness of the item, choose a lower quartile price for the object.
        Analyze the object, and decide a very short description name for it, 3-7 words. Note that item will fill 90% of the frame.
        Your response should be a list of two values in the format of ["name of object", price] exactly.
        Only output the list, nothing else, do not include any other text or comments.
        The object should be a common household item, if it is not, be safe and return the name, but set the price to 0.
        """
        
        # Get response from Gemini
        response = self.model.generate_content([prompt, image])
        
        try:
            # Parse the response into a tuple
            result = ast.literal_eval(response.text)
            if isinstance(result, list) and len(result) == 2:
                return (result[0], int(result[1]))
            else:
                raise ValueError("Invalid response format")
        except (ValueError, SyntaxError) as e:
            raise ValueError(f"Could not parse response: {str(e)}")