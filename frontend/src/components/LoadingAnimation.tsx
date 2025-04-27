'use client';

import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  progress: number;
}

export default function LoadingAnimation({ progress }: LoadingAnimationProps) {
  return (
    <div className="w-full mt-6">
      {/* Progress bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Animated dots that move across the progress bar */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            className="absolute top-0 h-full w-20 bg-white/30"
            animate={{
              left: ['0%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear',
            }}
          />
        </div>
      </div>
      
      {/* Progress percentage */}
      <div className="mt-4 flex items-center justify-center">
        <div className="relative">
          <motion.div
            className="text-xl font-semibold text-blue-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={progress}
          >
            {progress}%
          </motion.div>
        </div>
        
        {/* Status message */}
        <motion.div 
          className="ml-4 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {progress < 25 ? (
            "Preparing your video..."
          ) : progress < 50 ? (
            "Uploading to secure storage..."
          ) : progress < 75 ? (
            "Processing video frames..."
          ) : progress < 100 ? (
            "Almost there..."
          ) : (
            "Upload complete!"
          )}
        </motion.div>
      </div>
      
      {/* Animated icons */}
      <div className="flex justify-center mt-6 space-x-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`w-12 h-12 flex items-center justify-center rounded-full 
                      ${progress >= (i + 1) * 25 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
            animate={{
              scale: progress >= (i + 1) * 25 ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: progress >= (i + 1) * 25 ? 0 : 0,
            }}
          >
            {i === 0 ? (
              <span className="text-xl">📤</span>
            ) : i === 1 ? (
              <span className="text-xl">🔒</span>
            ) : i === 2 ? (
              <span className="text-xl">🎬</span>
            ) : (
              <span className="text-xl">✅</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
