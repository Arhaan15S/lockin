'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/dashboard'
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f3f4f6', marginBottom: 8 }}>Lock<span style={{ color: '#22c55e' }}>In</span></h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>Sign in to your account</p>
        {error && <div style={{ background: '#1f0a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '12px 16px', color: '#fca5a5', fontSize: 14, marginBottom: 20 }}>{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid #1f2937', borderRadius: 8, padding: '12px 16px', color: '#e5e7eb', fontSize: 15, fontFamily: 'inherit', marginBottom: 12, outline: 'none' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', background: '#111', border: '1px solid #1f2937', borderRadius: 8, padding: '12px 16px', color: '#e5e7eb', fontSize: 15, fontFamily: 'inherit', marginBottom: 24, outline: 'none' }} />
        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 20 }}>
          No account? <a href="/signup" style={{ color: '#22c55e', textDecoration: 'none' }}>Sign up</a>
        </p>
      </div>
    </div>
  )
}