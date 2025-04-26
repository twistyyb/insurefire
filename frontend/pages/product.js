import { useState } from 'react'
import Layout from '../components/Layout'
import styles from '../styles/Product.module.css'

export default function Product() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setResult('')
  }

  const handleSubmit = () => {
    if (!file) return
    setLoading(true)
    // Replace with actual API call
    setTimeout(() => {
      setResult(`✅ Successfully processed "${file.name}"`)
      setLoading(false)
    }, 2000)
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
          {loading ? 'Processing…' : 'Submit'}
        </button>

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
