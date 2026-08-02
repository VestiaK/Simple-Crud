"use client";
import { useState } from 'react'
import Link from 'next/link'
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
    setError(message || 'Pendaftaran gagal')
  } finally {
    setLoading(false)
  }
  }

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo}>Perusahaan</div>
          <h1 className={styles.title}>Masuk ke akun Anda</h1>
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
            Kata sandi
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
              <input type="checkbox" /> Ingat saya
            </label>
            <a className={styles.link} href="/forgot-password">Lupa kata sandi?</a>
          </div>

          <button className={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className={styles.signup}>
            Belum punya akun? <Link href="/signup" className={styles.link}>Daftar</Link>
          </p>
        </form>
      </main>
    </div>
  )
}