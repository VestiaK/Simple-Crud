"use client";
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Auth.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error(await res.text())
      window.location.href = '/home'
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Login failed, please check your credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <header className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={56} 
              height={56} 
              priority 
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className={styles.logo} style={{ color: '#2596be' }}>PT Surveyor Indonesia</div>
          <h1 className={styles.title}>Sign in to your account</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <label className={styles.label}>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </label>

          <div className={styles.row}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Remember me
            </label>
            <a className={styles.link} href="#" style={{ color: '#2596be' }}>Forgot password?</a>
          </div>

          <button className={styles.button} disabled={loading} style={{ backgroundColor: '#2596be', color: '#ffffff' }}>
            {loading ? 'Processing...' : 'Sign In'}
          </button>

          <p className={styles.signup}>
            Don&apost have an account? <Link href="/signup" className={styles.link} style={{ color: '#2596be' }}>Sign Up</Link>
          </p>
        </form>
      </main>
    </div>
  )
}