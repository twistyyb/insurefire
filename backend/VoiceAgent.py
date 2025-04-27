"""
Embers Voice Agent with ElevenLabs and OpenAI Integration

This module provides a voice-based conversational agent that:
1. Uses OpenAI Whisper for speech-to-text
2. Uses ElevenLabs for text-to-speech
3. Uses Gemini for intelligent conversation
4. Focuses on gathering detailed item information and providing insurance recommendations

Dependencies:
- requests
- pygame
- google-generativeai
- python-dotenv
- pyaudio
"""

import os
import json
import time
import threading
import pyaudio
import wave
import requests
import pygame
from pygame import mixer
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
ELEVEN_LABS_API_KEY = os.environ.get("ELEVEN_LABS_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Initialize pygame mixer for audio playback
mixer.init()

class VoiceAgent:
    def __init__(self, detected_items=None):
        """
        Initialize the Voice Agent with detected items from YOLO.
        
        Args:
            detected_items (dict): Dictionary of items detected by YOLO with initial valuations
        """
        self.detected_items = detected_items or {}
        self.conversation_history = []
        self.item_details = {}  # Will store additional details gathered during conversation
        
        # Initialize Gemini model
        self.gemini = genai.GenerativeModel(model_name='gemini-2.0-flash-lite')
        
        # Audio recording parameters
        self.chunk = 1024
        self.audio_format = pyaudio.paInt16
        self.channels = 1
        self.rate = 44100
        self.record_seconds = 10  # Default recording time
        self.is_recording = False
        self.frames = []
        
        # Audio file management
        self.audio_file_path = "user_input.wav"
        
        # ElevenLabs voice settings
        self.voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
        self.model_id = "eleven_monolingual_v1"
        
        # Conversation state
        self.current_item = None
        self.conversation_stage = "introduction"  # introduction, item_details, valuation, insurance
        self.total_detected_value = 0
        
    def start_conversation(self):
        """Start the voice conversation flow"""
        # Clear any existing audio files at the start
        self._clear_audio_files()
        
        # Welcome message
        welcome_message = self._generate_welcome_message()
        self._speak(welcome_message)
        
        # Calculate total value of all detected items for reference
        self.total_detected_value = sum(item.get("estimated_price", 0) for item in self.detected_items.values() if item.get("estimated_price") is not None)
        
        # Add to conversation history
        self._add_to_history("assistant", welcome_message)
        
        # Main conversation loop
        self.conversation_stage = "introduction"
        while True:
            # Listen for user input
            user_input = self._listen()
            if not user_input:
                continue
                
            # Add to conversation history
            self._add_to_history("user", user_input)
            
            # Process user input and generate response
            response = self._process_user_input(user_input)
            
            # Speak response
            self._speak(response)
            
            # Add to conversation history
            self._add_to_history("assistant", response)
            
            # Check if conversation should end
            if "thank you" in user_input.lower() and "goodbye" in user_input.lower():
                self._speak("You're welcome! Thank you for using Embers. Goodbye!")
                # Clear audio files when conversation ends
                self._clear_audio_files()
                break
                
            # Short pause between turns
            time.sleep(0.5)
            
    def _generate_welcome_message(self):
        """Generate a welcome message based on detected items"""
        if not self.detected_items:
            return "Hi, I'm Embers. What item would you like me to value today?"
        
        item_count = len(self.detected_items)
        total_value = sum(item.get("estimated_price", 0) for item in self.detected_items.values() if item.get("estimated_price") is not None)
        
        message = f"Hi, I'm Embers. I detected {item_count} items in your video with a total estimated value of ${total_value:.2f}. "
        message += "Would you like to provide more context for any specific item, or would you prefer to discuss fire insurance options based on your current inventory?"
        
        return message
        
    def _listen(self):
        """Record audio and convert to text using OpenAI Whisper"""
        # Record audio
        audio_file = self._record_audio()
        if not audio_file:
            return None
            
        # Transcribe audio
        transcription = self._transcribe_audio(audio_file)
        if not transcription:
            return None
            
        print(f"You said: {transcription}")
        return transcription
        
    def _record_audio(self):
        """Record audio from microphone"""
        print("Recording...")
        self.frames = []  # Clear previous frames
        self.is_recording = True
        
        # Clear any existing audio files before recording
        self._clear_audio_files()
        
        try:
            p = pyaudio.PyAudio()
            
            # Get default input device
            default_device_info = p.get_default_input_device_info()
            print(f"Using input device: {default_device_info['name']}")
            
            # Open audio stream
            stream = p.open(format=self.audio_format,
                            channels=self.channels,
                            rate=self.rate,
                            input=True,
                            input_device_index=default_device_info['index'],
                            frames_per_buffer=self.chunk)
            
            # Record for specified duration
            for i in range(0, int(self.rate / self.chunk * self.record_seconds)):
                if not self.is_recording:
                    break
                    
                data = stream.read(self.chunk, exception_on_overflow=False)
                self.frames.append(data)
                
            # Stop and close stream
            stream.stop_stream()
            stream.close()
            p.terminate()
            
            # Save to file
            audio_file = self.audio_file_path
            wf = wave.open(audio_file, 'wb')
            wf.setnchannels(self.channels)
            wf.setsampwidth(p.get_sample_size(self.audio_format))
            wf.setframerate(self.rate)
            wf.writeframes(b''.join(self.frames))
            wf.close()
            
            print("Recording complete.")
            self.is_recording = False
            return audio_file
            
        except Exception as e:
            print(f"Error recording audio: {e}")
            self.is_recording = False
            return None
            
    def _transcribe_audio(self, audio_file):
        """Transcribe audio using OpenAI Whisper API"""
        print("Transcribing audio...")
        
        try:
            url = "https://api.openai.com/v1/audio/transcriptions"
            
            headers = {
                "Authorization": f"Bearer {OPENAI_API_KEY}"
            }
            
            with open(audio_file, "rb") as audio:
                files = {
                    "file": ("audio.wav", audio, "audio/wav")
                }
                data = {
                    "model": "whisper-1"
                }
                
                response = requests.post(url, headers=headers, files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                transcription = result.get("text", "")
                return transcription
            else:
                print(f"Transcription error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"Transcription error: {e}")
            return None
            
    def _speak(self, text):
        """Convert text to speech using ElevenLabs API"""
        print("Converting text to speech...")
        
        try:
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": ELEVEN_LABS_API_KEY
            }
            
            data = {
                "text": text,
                "model_id": self.model_id,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5
                }
            }
            
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                # Save audio to a temporary file
                temp_file = "temp_speech.mp3"
                with open(temp_file, "wb") as f:
                    f.write(response.content)
                
                # Play audio
                mixer.music.load(temp_file)
                mixer.music.play()
                
                # Wait for audio to finish playing
                while mixer.music.get_busy():
                    pygame.time.wait(100)
                
                # Clean up
                mixer.music.unload()
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            else:
                print(f"TTS error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"TTS error: {e}")
            
    def _clear_audio_files(self):
        """Clear any existing audio files"""
        try:
            if os.path.exists(self.audio_file_path):
                os.remove(self.audio_file_path)
                print(f"Removed previous audio file: {self.audio_file_path}")
        except Exception as e:
            print(f"Error clearing audio file: {e}")
            
    def _process_user_input(self, user_input):
        """Process user input and generate response based on conversation stage"""
        # Check if user is asking about total valuation
        if "total" in user_input.lower() and ("value" in user_input.lower() or "valuation" in user_input.lower() or "cost" in user_input.lower() or "worth" in user_input.lower()):
            self.conversation_stage = "valuation"
            
        # Check if user wants to discuss insurance
        if "insurance" in user_input.lower() or "coverage" in user_input.lower() or "policy" in user_input.lower() or "protect" in user_input.lower() or "fire" in user_input.lower():
            self.conversation_stage = "insurance"
            
        # Generate system prompt based on current conversation stage
        system_prompt = self._generate_system_prompt()
        
        # Add information about detected items to the system prompt
        if self.detected_items:
            items_info = "\n\nDETECTED ITEMS WITH VALUATIONS:\n"
            for item_id, item_data in self.detected_items.items():
                price = item_data.get("estimated_price")
                price_str = f"${price:.2f}" if price is not None else "Price not available"
                items_info += f"- {item_data.get('estimated_name', item_id)}: {price_str}\n"
            system_prompt += items_info
            
            # Add total valuation information
            total_value = sum(item.get("estimated_price", 0) for item in self.detected_items.values() if item.get("estimated_price") is not None)
            system_prompt += f"\nTOTAL ESTIMATED VALUE: ${total_value:.2f}"
        
        # Prepare conversation for Gemini
        conversation = []
        
        # Add system prompt as a model message (since Gemini doesn't support system role)
        conversation.append({
            "role": "model",
            "parts": [system_prompt]
        })
        
        # Add conversation history
        for message in self.conversation_history:
            conversation.append({
                "role": message["role"],
                "parts": [message["content"]]
            })
        
        # Get response from Gemini
        response = self.gemini.generate_content(conversation)
        
        # Update conversation stage based on response
        self._update_conversation_stage(user_input, response.text)
        
        # Extract and store item details if in item_details stage
        if self.conversation_stage == "item_details" and self.current_item:
            self._extract_item_details(user_input, response.text)
        
        return response.text
        
    def _generate_system_prompt(self):
        """Generate system prompt based on conversation stage"""
        base_prompt = """
You are Embers' AI voice assistant specializing in home inventory valuation and fire insurance guidance. 
Your goal is to have a concise conversation with the user to gather basic information about their items,
provide valuations immediately, and offer personalized fire insurance advice when requested.

IMPORTANT GUIDELINES:
1. Be extremely concise - keep responses under 2 sentences when possible
2. Focus on item valuation first, then offer fire insurance advice if requested
3. Don't ask for detailed specifications if the user doesn't provide them initially
4. Accept whatever information the user provides and give your best valuation estimate
5. Don't pronounce or read aloud any special characters like asterisks (*), markdown formatting, etc.
6. If the user mentions an item with year, brand, and size, provide a valuation immediately
7. When asked about total valuation, provide the sum of all detected items' values
8. Be aware of the existing valuations for items already detected in the video
9. After providing updated valuations, ask if the user would like fire insurance information
10. When discussing insurance, ask about the user's location, home type, and risk factors
"""
        
        if self.conversation_stage == "introduction":
            prompt = base_prompt + """
Briefly introduce yourself and ask if the user wants to:
1. Provide context for specific items to update their valuation
2. Get the total valuation of their inventory
3. Discuss fire insurance options based on their inventory

Keep it short and direct - no lengthy explanations needed.
"""
        
        elif self.conversation_stage == "item_details":
            prompt = base_prompt + f"""
You are currently discussing the {self.current_item} detected in the user's video.
Provide immediate valuations based on whatever information the user shares.
If they mention brand, age, or condition - use that to refine your estimate.
Do not ask for additional details unless absolutely necessary.
Respond with a direct valuation whenever possible.
"""
        
        elif self.conversation_stage == "valuation":
            # Calculate total value of all detected items
            total_value = sum(item.get("estimated_price", 0) for item in self.detected_items.values() if item.get("estimated_price") is not None)
            item_count = len(self.detected_items)
            
            prompt = base_prompt + f"""
You are providing valuations for the user's items.

IMPORTANT CONTEXT:
- {item_count} items were detected in the video with a total estimated value of ${total_value:.2f}
- When asked about total valuation, include this information
- If asked about specific items, provide their individual valuations from the detected items
- After providing updated valuations, ask if the user would like fire insurance information
- Do not ask for additional details unless absolutely necessary
"""
        
        elif self.conversation_stage == "insurance":
            prompt = base_prompt + """
You are providing personalized fire insurance advice based on the user's inventory and profile.

IMPORTANT GUIDELINES:
1. Ask about the user's location, home type (apartment, house, etc.), and any specific risk factors
2. Provide tailored insurance recommendations based on their total inventory value and profile
3. Suggest appropriate coverage levels based on their total valuation
4. Recommend specific fire prevention measures based on their inventory
5. Be specific and actionable in your advice
6. Keep explanations brief but informative
"""

        return prompt
        
    def _update_conversation_stage(self, user_input, assistant_response):
        """Update conversation stage based on user input and assistant response"""
        if self.conversation_stage == "introduction":
            if any(phrase in user_input.lower() for phrase in ["yes", "ready", "let's start", "begin"]):
                self.conversation_stage = "item_details"
                # Set the first item as current item
                if self.detected_items:
                    self.current_item = next(iter(self.detected_items))
        
        elif self.conversation_stage == "item_details":
            # Check if we've gathered enough details about the current item
            if "move on" in assistant_response.lower() or "next item" in assistant_response.lower():
                # Move to the next item or to valuation if all items are done
                items = list(self.detected_items.keys())
                current_index = items.index(self.current_item)
                
                if current_index < len(items) - 1:
                    # Move to next item
                    self.current_item = items[current_index + 1]
                else:
                    # All items done, move to valuation
                    self.conversation_stage = "valuation"
        
        elif self.conversation_stage == "valuation":
            if "insurance" in assistant_response.lower() or "recommend" in assistant_response.lower():
                self.conversation_stage = "insurance"
                
    def _extract_item_details(self, user_input, assistant_response):
        """Extract item details from conversation and update item_details dictionary"""
        # Initialize item details if not already present
        if self.current_item not in self.item_details:
            self.item_details[self.current_item] = {
                "brand": None,
                "model": None,
                "age": None,
                "condition": None,
                "purchase_price": None,
                "special_features": None
            }
            
        # Extract details using simple keyword matching
        # In a production system, this would use more sophisticated NLP
        details = self.item_details[self.current_item]
        
        if "brand" in user_input.lower() and details["brand"] is None:
            # Simple extraction - in production would use NER
            words = user_input.split()
            brand_idx = words.index("brand") if "brand" in words else -1
            if brand_idx >= 0 and brand_idx < len(words) - 2:
                details["brand"] = words[brand_idx + 2]  # Assuming format "the brand is X"
                
        if "years old" in user_input.lower() and details["age"] is None:
            # Extract age
            words = user_input.split()
            for i, word in enumerate(words):
                if word.isdigit() and i < len(words) - 2 and words[i+1] == "years" and words[i+2] == "old":
                    details["age"] = int(word)
                    break
                    
        # Similar extractions for other fields
        # This is simplified - a production system would use more robust NLP
        
    def _add_to_history(self, role, content):
        """Add a message to conversation history"""
        self.conversation_history.append({
            "role": "user" if role == "user" else "model",
            "content": content
        })
        
    def get_refined_valuations(self):
        """Calculate refined valuations based on gathered details"""
        refined_valuations = {}
        
        for item_id, original_data in self.detected_items.items():
            # Start with original valuation
            original_value = original_data.get("estimated_price", 0)
            refined_value = original_value
            
            # Adjust based on gathered details
            if item_id in self.item_details:
                details = self.item_details[item_id]
                
                # Adjust for brand (premium brands increase value)
                if details["brand"] in ["Apple", "Samsung", "Sony", "LG"]:
                    refined_value *= 1.2
                
                # Adjust for age (newer items worth more)
                if details["age"] is not None:
                    if details["age"] < 1:  # Less than a year old
                        refined_value *= 1.1
                    elif details["age"] > 5:  # More than 5 years old
                        refined_value *= 0.7
                
                # Adjust for condition
                if details["condition"] == "excellent":
                    refined_value *= 1.1
                elif details["condition"] == "poor":
                    refined_value *= 0.6
            
            refined_valuations[item_id] = {
                "original_value": original_value,
                "refined_value": refined_value,
                "details": self.item_details.get(item_id, {})
            }
            
        return refined_valuations
        
    def get_insurance_recommendations(self):
        """Generate insurance recommendations based on refined valuations"""
        # This would typically call Gemini with a specialized prompt
        # For now, we'll return a placeholder
        total_value = sum(v["refined_value"] for v in self.get_refined_valuations().values())
        
        recommendations = {
            "total_value": total_value,
            "coverage_type": "replacement cost" if total_value > 5000 else "actual cash value",
            "special_riders": [],
            "documentation": [
                "Keep receipts for all high-value items",
                "Take photos of items from multiple angles",
                "Create a digital inventory with serial numbers"
            ],
            "fire_protection": [
                "Install smoke detectors near valuable electronics",
                "Consider a home safe for important documents",
                "Keep fire extinguishers accessible"
            ]
        }
        
        # Add special riders for high-value items
        for item_id, valuation in self.get_refined_valuations().items():
            if valuation["refined_value"] > 1000:
                item_class = self.detected_items[item_id].get("class", "item")
                recommendations["special_riders"].append(f"Scheduled personal property rider for {item_class}")
        
        return recommendations
