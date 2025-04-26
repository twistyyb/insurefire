import Link from 'next/link'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <section className={styles.hero}>
        <h1>InsureFire</h1>
        <p>
          Capture a video tour of your home—before a fire happens—and keep your
          coverage up to date.
        </p>
        {/* Button as Link (no <a>) */}
        <Link href="/product" className={styles.button}>
          Get Started
        </Link>
      </section>
    </Layout>
  )
}
