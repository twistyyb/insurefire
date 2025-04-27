import { supabase } from './supabase';
 
 const BUCKET_NAME = 'file-upload';
 
 interface FileUploadResult {
   path: string;
   url: string;
   name: string;
   original_name: string;
   size: number;
   type: string;
   data_type: string;
   id?: string;
   job_id?: string;
 }
 
 // Function to upload a single file to Supabase storage
 export const uploadFileToSupabase = async (file: File, jobId: any, dataType: string): Promise<FileUploadResult> => {
   try {
     // Create a unique filename to avoid collisions
     const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
     
     // Sanitize filename - replace spaces and special characters
     const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
     
     // Create safe path segments
     const safeDataType = dataType.replace(/[^a-zA-Z0-9-]/g, '');
     
     // File path structure
     const filePath = `${safeDataType}/${uniquePrefix}-${sanitizedFileName}`;
 
     console.log(`Attempting to upload file to: ${filePath}`);
     console.log(`File type: ${file.type}`);
 
     // Upload to Supabase storage
     const { data, error } = await supabase.storage
       .from(BUCKET_NAME)
       .upload(filePath, file, {
         cacheControl: '3600',
         upsert: true,
         contentType: file.type || 'application/octet-stream'
       });
 
     if (error) {
       console.error('Supabase upload error details:', error);
       throw new Error(`Supabase upload failed: ${error.message}`);
     }
 
     // Get the public URL for the file
     const { data: { publicUrl } } = supabase.storage
       .from(BUCKET_NAME)
       .getPublicUrl(filePath);
 
     console.log(`File uploaded successfully to: ${filePath}`);
     
     // Use the same user ID as in the Python implementation
     const userId = "66274d9c-6ece-4eeb-a8ed-19051a8a2103";
     
     // Save file metadata to database
     const { data: fileData, error: fileError } = await supabase
       .from('file_uploads')
       .insert({
         user_id: userId,
         file_name: sanitizedFileName,
         original_name: file.name,
         file_size: file.size,
         file_type: file.type || 'application/octet-stream',
         file_path: filePath,
         public_url: publicUrl,
         data_type: dataType,
         job_id: jobId
       })
       .select()
       .single();
       
     if (fileError) {
       console.error('Error saving file metadata:', fileError);
       // Don't throw here - we still want to return the file info even if DB save fails
     }
     
     return {
       path: filePath,
       url: publicUrl,
       name: sanitizedFileName,
       original_name: file.name,
       size: file.size,
       type: file.type,
       data_type: dataType,
       id: fileData?.id,
       job_id: jobId
     };
   } catch (error) {
     console.error('Error uploading file:', error);
     throw error;
   }
 };