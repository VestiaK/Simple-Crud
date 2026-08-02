import { useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Auth.module.css'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) throw new Error(await res.text())
      window.location.href = '/login'
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    setError(message || 'Login gagal')
  } finally {
    setLoading(false)
  }
  }

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo}>Perusahaan</div>
          <h1 className={styles.title}>Buat akun baru</h1>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <label className={styles.label}>
            Nama lengkap
            <input value={name} onChange={(e) => setName(e.target.value)} className={styles.input} required />
          </label>

          <label className={styles.label}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
          </label>

          <label className={styles.label}>
            Kata sandi
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
          </label>

          <button className={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p className={styles.signup}>
            Sudah punya akun? <Link href="/login" className={styles.link}>Masuk</Link>
          </p>
        </form>
      </main>
    </div>
  )
}