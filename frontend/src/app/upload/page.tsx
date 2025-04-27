'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoadingAnimation from '@/components/LoadingAnimation';
import { uploadFileToSupabase } from '@/components/fileUpload';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch the latest frame
  const fetchLatestFrame = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/latest-frame');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setCurrentFrame(url);
      }
    } catch (err) {
      console.error('Error fetching frame:', err);
    }
  };

  // Start polling for frames when processing starts
  useEffect(() => {
    if (isProcessing && showVisualization) {
      frameIntervalRef.current = setInterval(fetchLatestFrame, 1000); // Poll every 1 second
    } else {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
    }

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
    };
  }, [isProcessing, showVisualization]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && !selectedFile.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile && !droppedFile.type.startsWith('video/')) {
      setError('Please drop a video file');
      return;
    }
    
    setFile(droppedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file first');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      // Step 1: Create a job ID
      const jobResponse = await fetch('http://localhost:8080/api/create-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!jobResponse.ok) {
        throw new Error('Failed to create job');
      }

      const { job_id } = await jobResponse.json();
      setUploadProgress(33);

      // Step 2: Upload to Supabase with job ID
      const result = await uploadFileToSupabase(file, job_id, "video");
      setUploadProgress(66);

      if (showVisualization) {
        activateProcessing();
      }

      // Step 3: Send the Supabase URL to backend for processing
      const processResponse = await fetch('http://localhost:8080/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: result.url,
          job_id: job_id,
          show_display: showVisualization
        }),
      });

      if (!processResponse.ok) {
        throw new Error('Failed to start video processing');
      }

      if (!showVisualization) {
        setIsProcessing(false);
      }

      setUploadProgress(100);

      // Redirect to results page
      setTimeout(() => {
        router.push(`/results/${job_id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const activateProcessing = () => {
    setTimeout(() => {
      setIsProcessing(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Upload Your Video</h1>
        
        <div className="max-w-3xl w-full">
          {!isUploading ? (
            <div 
              className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ minHeight: '300px' }}
            >
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {!file ? (
                <>
                  <div className="text-5xl mb-4">🎥</div>
                  <p className="text-xl text-gray-600 mb-2">Drag and drop your video here</p>
                  <p className="text-gray-500">or click to browse files</p>
                  <p className="text-sm text-gray-400 mt-4">Supported formats: MP4</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">🎥</div>
                  <p className="text-xl text-gray-700 mb-2">Selected file:</p>
                  <p className="text-blue-600 font-medium">{file.name}</p>
                  <p className="text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button 
                    className="mt-4 text-sm text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Remove file
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="w-full rounded-xl overflow-hidden bg-gray-900 shadow-lg" style={{ minHeight: '300px' }}>
              {currentFrame && (
                <div className="relative">
                  <img 
                    src={currentFrame} 
                    alt="Live analysis frame" 
                    className="w-full"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                </div>
              )}
              <div className="p-4 bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Processing Video</span>
                  <span className="text-sm font-medium text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-500">{error}</div>
          )}

          {success && (
            <div className="mt-4 text-green-500">{success}</div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                file && !isUploading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Processing...' : 'Process Video'}
            </button>

            <label className={`flex items-center space-x-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={showVisualization}
                onChange={(e) => setShowVisualization(e.target.checked)}
                disabled={isUploading}
                className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-gray-700 ${isUploading ? 'text-gray-400' : ''}`}>Visualize Processing</span>
            </label>
          </div>
          
          <div className="mt-12 bg-blue-50 p-6 rounded-lg max-w-2xl">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Tips for best results:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Record a slow, steady video of your home</li>
              <li>Make sure items are clearly visible</li>
              <li>Good lighting helps with item recognition</li>
              <li>Try to capture items from multiple angles</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
