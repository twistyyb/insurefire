import { useState } from 'react'
import Layout from '../components/Layout'
import styles from '../styles/Product.module.css'
import { uploadFileToSupabase } from '../components/fileUpload'

export default function Product() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inventory, setInventory] = useState(null)

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setResult('')
    setError('')
    setInventory(null)
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult('')
    setInventory(null)

    try {
      const uploadedFile = await uploadFileToSupabase(file, 'video')
      setResult(`Processing... "${uploadedFile.url}"`)
      console.log('Uploaded file details:', uploadedFile)

      // Call the Python backend to process the uploaded file
      console.log('calling backend:', uploadedFile.url)
      const response = await fetch('http://localhost:8080/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl: uploadedFile.url })
      })

      if (!response.ok) {
        throw new Error('Failed to process video')
      }

      const data = await response.json()
      if (data.status === 'success') {
        setInventory(data.results)
        setResult(`✅ Successfully processed video. Found ${data.results.total_items} items worth $${data.results.total_value.toLocaleString()}`)
      } else {
        throw new Error(data.error || 'Failed to process video')
      }

    } catch (err) {
      console.error('Upload error:', err)
      setError(`❌ Error: ${err.message}`)
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
          {loading ? 'Processing...' : 'Upload and Process'}
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

        {inventory && (
          <div className={styles.inventory}>
            <h3>Inventory Details</h3>
            <p>Total Items: {inventory.total_items}</p>
            <p>Total Value: ${inventory.total_value.toLocaleString()}</p>
            <p>Metadata Path: {inventory.metadata_path}</p>
            <p>Snapshot Directory: {inventory.snapshot_dir}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
