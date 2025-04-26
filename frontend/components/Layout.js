import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>InsureFire</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header className={styles.header}>
        {/* Logo (Link → img) */}
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="InsureFire logo" />
        </Link>

        {/* Nav (Link only, no <a>) */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/product" className={styles.navLink}>
            Product
          </Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  )
}
