'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { getLatestJobResult, getJobResultById } from '@/lib/supabaseQueries';
import ItemCard from '@/components/ItemCard';

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id');

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);

        let data;
        if (jobId) {
          // Use the job_id from URL parameters
          console.log(`Fetching results for job ID: ${jobId}`);
          data = await getJobResultById(jobId);
        } else {
          // Fallback to latest job result if no job_id is provided
          console.log('No job ID provided, fetching latest result');
          data = await getLatestJobResult();
        }
        
        if (data) {
          console.log('Data retrieved successfully:', data);
          setResults(data);
        } else {
          console.log("No data found in Supabase");
          setError('No results found. Please try uploading a video first.');
          setUsingSampleData(true);
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [jobId]);

  // Calculate total value and item count if results are available
  const totalValue = results ? Object.values(results).reduce((sum: number, item: any) => 
    sum + (item.estimated_price || 0), 0) : 0;
  const itemCount = results ? Object.keys(results).length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Inventory Results</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <Link href="/upload" className="text-blue-500 underline mt-2 inline-block">
              Go to Upload Page
            </Link>
          </div>
        ) : (
          <>
            {jobId && (
              <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded mb-4">
                <p>Viewing results for job: {jobId}</p>
              </div>
            )}
            
            {/* Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Inventory Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Estimated Value</p>
                  <p className="text-2xl font-bold text-blue-600">${totalValue.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Items Identified</p>
                  <p className="text-2xl font-bold text-green-600">{itemCount}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Items Grid */}
            <h2 className="text-xl font-semibold mb-4">Identified Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results && Object.entries(results).map(([key, item]: [string, any], index) => (
                <ItemCard key={key} itemKey={key} item={item} index={index} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/upload" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Upload Another Video
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
