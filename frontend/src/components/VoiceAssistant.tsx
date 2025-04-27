'use client';

import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaPlay } from 'react-icons/fa';

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantProps {
  jobId: string;
  itemsData: any;
}

export default function VoiceAssistant({ jobId, itemsData }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  // Calculate total value for context
  const totalValue = Object.values(itemsData).reduce((sum: number, item: any) => 
    sum + (item.estimated_price || 0), 0);

  // Initialize voice agent on component mount
  useEffect(() => {
    const initializeVoiceAgent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/voice/initialize/${jobId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setConversation([{
            role: 'assistant',
            content: data.message
          }]);
        } else {
          setError('Failed to initialize voice assistant');
        }
      } catch (err) {
        console.error('Error initializing voice agent:', err);
        setError('Error connecting to voice assistant');
      } finally {
        setLoading(false);
      }
    };
    
    initializeVoiceAgent();
  }, [jobId]);

  // Scroll to bottom of conversation when it updates
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  // Handle recording start
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configure for WAV format compatible with Whisper
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Most compatible format across browsers
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please check your browser permissions.');
    }
  };

  // Handle recording stop
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setLoading(true);
    }
  };

  // Process audio after recording stops
  const handleRecordingStop = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Convert blob to base64 for audio playback
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Process audio with backend
        await processAudioWithBackend(base64Audio);
      };
    } catch (err) {
      console.error('Error processing recording:', err);
      setError('Error processing your voice input. Please try again.');
      setLoading(false);
    }
  };

  // Process audio with backend
  const processAudioWithBackend = async (audioData: string) => {
    try {
      // Add user's audio as a "processing" message
      setConversation(prev => [...prev, {
        role: 'user',
        content: 'Processing your audio...'
      }]);
      
      // Send audio to backend API
      const response = await fetch('http://localhost:8080/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          audio: audioData
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Update user message with transcription
        setConversation(prev => {
          const newConversation = [...prev];
          newConversation[newConversation.length - 1] = {
            role: 'user',
            content: data.transcription
          };
          return newConversation;
        });
        
        // Add assistant response
        setConversation(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }]);
        
        // Play audio response from backend
        if (data.speech) {
          const audio = new Audio(data.speech);
          audioRef.current = audio;
          audio.onplay = () => setIsPlaying(true);
          audio.onended = () => setIsPlaying(false);
          audio.play().catch(err => {
            console.error('Error playing audio:', err);
          });
        }
      } else {
        setError(data.error || 'Error processing audio');
        // Update the user message to indicate error
        setConversation(prev => {
          const newConversation = [...prev];
          newConversation[newConversation.length - 1] = {
            role: 'user',
            content: 'Error processing audio. Please try again.'
          };
          return newConversation;
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error processing audio with backend:', err);
      setError('Error communicating with the voice assistant. Please try again.');
      setLoading(false);
      
      // Update the user message to indicate error
      setConversation(prev => {
        const newConversation = [...prev];
        newConversation[newConversation.length - 1] = {
          role: 'user',
          content: 'Error processing audio. Please try again.'
        };
        return newConversation;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Voice Assistant</h2>
      
      {/* Conversation Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
        {conversation.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 ${message.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}`}
          >
            <span className="font-semibold">{message.role === 'assistant' ? 'Embers: ' : 'You: '}</span>
            {message.content}
          </div>
        ))}
        <div ref={conversationEndRef} />
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading || isPlaying}
          className={`rounded-full p-4 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          {isRecording ? <FaStop /> : <FaMicrophone />}
        </button>
      </div>
      
      {/* Status Messages */}
      {loading && (
        <p className="text-center mt-2 text-gray-600">Processing your request...</p>
      )}
      {error && (
        <p className="text-center mt-2 text-red-500">{error}</p>
      )}
      {isRecording && (
        <p className="text-center mt-2 text-red-500">Recording... (Click stop when finished)</p>
      )}
      
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
