'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

// Sample data for demonstration
const sampleResults = {
  "tv_1": {
    "class": "tv",
    "track_id": 1,
    "confidence": 0.5609278082847595,
    "first_seen_frame": 7,
    "snapshot_path": "item_snapshots/tv_1_id1_conf0.84_frame27.jpg",
    "estimated_value": null,
    "best_confidence": 0.8354297876358032,
    "snapshot_frame": 27,
    "estimated_name": "TV",
    "estimated_price": 800
  },
  "couch_1": {
    "class": "couch",
    "track_id": 4,
    "confidence": 0.732740044593811,
    "first_seen_frame": 91,
    "snapshot_path": "item_snapshots/couch_1_id4_conf0.80_frame133.jpg",
    "estimated_value": null,
    "best_confidence": 0.8019100427627563,
    "snapshot_frame": 133,
    "estimated_name": "Armchair",
    "estimated_price": 350
  },
  "bottle_1": {
    "class": "bottle",
    "track_id": 5,
    "confidence": 0.6697600483894348,
    "first_seen_frame": 109,
    "snapshot_path": "item_snapshots/bottle_1_id5_conf0.82_frame141.jpg",
    "estimated_value": null,
    "best_confidence": 0.8215103149414062,
    "snapshot_frame": 141,
    "estimated_name": "Bottle",
    "estimated_price": 15
  },
  "couch_2": {
    "class": "couch",
    "track_id": 7,
    "confidence": 0.8161981105804443,
    "first_seen_frame": 125,
    "snapshot_path": "item_snapshots/couch_2_id7_conf0.94_frame147.jpg",
    "estimated_value": null,
    "best_confidence": 0.9388172626495361,
    "snapshot_frame": 147,
    "estimated_name": "Sofa",
    "estimated_price": 1500
  },
  "remote_1": {
    "class": "remote",
    "track_id": 8,
    "confidence": 0.636238694190979,
    "first_seen_frame": 127,
    "snapshot_path": "item_snapshots/remote_1_id8_conf0.77_frame131.jpg",
    "estimated_value": null,
    "best_confidence": 0.773002028465271,
    "snapshot_frame": 131,
    "estimated_name": "Cell Phone",
    "estimated_price": 300
  },
  "suitcase_1": {
    "class": "suitcase",
    "track_id": 9,
    "confidence": 0.8003390431404114,
    "first_seen_frame": 185,
    "snapshot_path": "item_snapshots/suitcase_1_id9_conf0.81_frame197.jpg",
    "estimated_value": null,
    "best_confidence": 0.8083502650260925,
    "snapshot_frame": 197,
    "estimated_name": "Suitcase",
    "estimated_price": 150
  },
  "couch_3": {
    "class": "couch",
    "track_id": 10,
    "confidence": 0.8493145108222961,
    "first_seen_frame": 193,
    "snapshot_path": "item_snapshots/couch_3_id10_conf0.90_frame227.jpg",
    "estimated_value": null,
    "best_confidence": 0.8991255760192871,
    "snapshot_frame": 227,
    "estimated_name": "Armchair",
    "estimated_price": 250
  }
};

// Placeholder image URLs for demo purposes
const placeholderImages = {
  "tv": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=300&auto=format&fit=crop",
  "couch": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop",
  "bottle": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop",
  "remote": "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?q=80&w=300&auto=format&fit=crop",
  "suitcase": "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=300&auto=format&fit=crop"
};

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setResults(sampleResults);
      
      // Calculate total value
      const total = Object.values(sampleResults).reduce(
        (sum: number, item: any) => sum + (item.estimated_price || 0), 
        0
      );
      setTotalValue(total);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to get image URL (would use actual paths in production)
  const getImageUrl = (item: any) => {
    const itemClass = item.class;
    return placeholderImages[itemClass as keyof typeof placeholderImages] || 
           "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=300&auto=format&fit=crop";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-gray-600">Loading your inventory results...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center p-8">
        <div className="max-w-6xl w-full">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">Your Home Inventory Results</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've analyzed your video and identified the following items in your home.
              The estimated total value of these items is:
            </p>
            <div className="mt-4 text-4xl font-bold text-blue-600">
              ${totalValue.toLocaleString()}
            </div>
          </div>
          
          {/* Results summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-xl font-semibold text-blue-800">Items Identified</h3>
              <p className="text-3xl font-bold text-blue-600">{Object.keys(results).length}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="text-xl font-semibold text-blue-800">Total Value</h3>
              <p className="text-3xl font-bold text-blue-600">${totalValue.toLocaleString()}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="text-xl font-semibold text-blue-800">Insurance Ready</h3>
              <p className="text-lg text-blue-600">Download Report</p>
            </div>
          </div>
          
          {/* Item list */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Identified Items</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {Object.entries(results).map(([key, item]: [string, any]) => (
              <motion.div 
                key={key}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                variants={itemVariants}
              >
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={getImageUrl(item)} 
                    alt={item.estimated_name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.estimated_name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Estimated Value:</span>
                    <span className="text-xl font-bold text-blue-600">${item.estimated_price}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Confidence: {(item.best_confidence * 100).toFixed(1)}%</p>
                    <p>Category: {item.class}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Action buttons */}
          <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/upload"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Upload Another Video
            </Link>
            <button 
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              onClick={() => window.print()}
            >
              Print Inventory Report
            </button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        © 2025 InsureFire. All rights reserved.
      </footer>
    </div>
  );
}
