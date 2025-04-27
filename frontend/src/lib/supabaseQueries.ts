import { supabase } from '@/components/supabase';

/**
 * Fetches the latest job result from the job table
 * @returns The result column from the latest job, or null if no jobs exist
 */
export async function getLatestJobResult() {
  try {
    const { data, error } = await supabase
      .from('job')
      .select('result')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching latest job result:', error);
      return null;
    }
    
    return data?.result || null;
  } catch (error) {
    console.error('Exception fetching latest job result:', error);
    return null;
  }
}

/**
 * Fetches a job result by job ID
 * @param jobId The ID of the job to fetch
 * @returns The result column from the specified job, or null if not found
 */
export async function getJobResultById(jobId: string) {
  try {
    const { data, error } = await supabase
      .from('job')
      .select('result')
      .eq('id', jobId)
      .single();
    
    if (error) {
      console.error(`Error fetching job result for ID ${jobId}:`, error);
      return null;
    }
    
    return data?.result || null;
  } catch (error) {
    console.error(`Exception fetching job result for ID ${jobId}:`, error);
    return null;
  }
}
