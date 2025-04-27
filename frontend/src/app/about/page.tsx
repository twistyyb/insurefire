'use client';

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-10 pb-20">
        {/* Hero Section - White */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 mb-0 py-20 bg-white"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                Protecting What Matters Most
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Embers uses cutting-edge AI technology to help homeowners and renters 
                easily catalog their belongings for insurance purposes, giving you peace of mind 
                when you need it most.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/upload" 
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-md"
                >
                  Try It Now
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-gradient-to-br from-gray-300 to-gray-600 rounded-2xl p-1 shadow-xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                    alt="Modern living room" 
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-black rounded-lg p-4 shadow-lg">
                <p className="text-sm font-bold text-white">Protect your home with confidence</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section - White */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">How It Works</h2>
            <div className="max-w-3xl mx-auto space-y-8 mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">Record a Video</h3>
                  <p className="text-gray-600">Simply record a video walking through your home, capturing your belongings.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">Upload to Embers</h3>
                  <p className="text-gray-600">Upload your video to our secure platform.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">AI Analysis</h3>
                  <p className="text-gray-600">Our advanced AI identifies items in your video and estimates their value.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">Get Your Inventory</h3>
                  <p className="text-gray-600">Receive a detailed inventory with item descriptions, images, and estimated values.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section - Black */}
        <div className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">Our Technology</h2>
            
            <div className="max-w-3xl mx-auto text-white mb-10">
              <p className="text-gray-300 mb-6 text-center">
                InsureFire uses state-of-the-art computer vision and machine learning technologies:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-semibold mb-3">YOLO Object Detection</h3>
                  <p className="text-gray-300">Identifies items in your videos with high accuracy</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-semibold mb-3">Advanced Tracking</h3>
                  <p className="text-gray-300">Sophisticated algorithms to follow items across video frames</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-semibold mb-3">Google's Gemini AI</h3>
                  <p className="text-gray-300">Provides accurate value estimation for your belongings</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-semibold mb-3">Secure Cloud Storage</h3>
                  <p className="text-gray-300">Your inventory data is safely stored and easily accessible</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Black */}
      <footer className="bg-black text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Embursed</h3>
              <p className="text-gray-400">Protecting what matters most</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>Embursed. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
