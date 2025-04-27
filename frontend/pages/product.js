import { useState } from 'react'
import Layout from '../components/Layout'
import styles from '../styles/Product.module.css'
import { uploadFileToSupabase } from '../components/fileUpload'

export default function Product() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setResult('')
    setError('')
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult('')

    try {
      const uploadedFile = await uploadFileToSupabase(file, 'video')
      setResult(`✅ Successfully uploaded "${uploadedFile.url}"`)
      console.log('Uploaded file details:', uploadedFile)

      // Call the Python backend to process the uploaded file
      const response = await fetch('/api/process-video', {
        method: 'POST',
        body: JSON.stringify({ fileUrl: uploadedFile.url })
      })

      if (!response.ok) {
        throw new Error('Failed to process video')
      }

      const data = await response.json()
      setResult(`✅ Successfully processed video: ${data.result}`)








    } catch (err) {
      console.error('Upload error:', err)
      setError(`❌ Error uploading file: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Upload Your Video Tour</h2>
        <input
          type="file"
          accept="video/*"
          onChange={handleChange}
          className={styles.upload}
        />

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={styles.submit}
        >
          {loading ? 'Uploading…' : 'Upload'}
        </button>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className={styles.result}>
            <h3>Result</h3>
            <p>{result}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
