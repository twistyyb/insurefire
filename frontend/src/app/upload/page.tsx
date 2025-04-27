'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    setUploadProgress(0);

    // Simulate the entire upload process with fake data
    const simulateUpload = () => {
      let progress = 0;
      
      // Start with quick progress
      const initialInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 3) + 1;
        if (progress >= 30) {
          clearInterval(initialInterval);
          setUploadProgress(30);
          
          // Slow down in the middle (processing stage)
          const middleInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 2) + 1;
            if (progress >= 75) {
              clearInterval(middleInterval);
              setUploadProgress(75);
              
              // Speed up at the end
              const finalInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 3) + 1;
                if (progress >= 95) {
                  clearInterval(finalInterval);
                  setUploadProgress(95);
                  
                  // Complete the upload
                  setTimeout(() => {
                    setUploadProgress(100);
                    
                    // Redirect after showing 100% for a moment
                    setTimeout(() => {
                      // Use a fake ID for the results page
                      router.push(`/about`);
                    }, 1500);
                  }, 800);
                } else {
                  setUploadProgress(progress);
                }
              }, 300);
            } else {
              setUploadProgress(progress);
            }
          }, 400);
        } else {
          setUploadProgress(progress);
        }
      }, 200);
    };
    
    // Start the simulation
    simulateUpload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Upload Your Video</h1>
        
        <div className="max-w-3xl w-full">
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
                <p className="text-sm text-gray-400 mt-4">Supported formats: MP4, MOV, AVI</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">📹</div>
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

          {error && (
            <div className="mt-4 text-red-500">{error}</div>
          )}

          {isUploading && (
            <LoadingAnimation progress={uploadProgress} />
          )}

          <button
            className={`mt-8 px-8 py-3 rounded-lg font-medium transition-colors ${
              file && !isUploading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Process Video'}
          </button>
          
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
