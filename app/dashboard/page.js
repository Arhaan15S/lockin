'use client'

import { useState, useEffect, useRef } from 'react'

const TABS = ['summary', 'concepts', 'questions', 'flashcards', 'memorize']
const TAB_LABELS = { summary: 'Summary', concepts: 'Key Concepts', questions: 'Test Qs', flashcards: 'Flashcards', memorize: 'Memorize' }

function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div onClick={() => setFlipped(f => !f)} style={{ background: flipped ? '#0f2a0f' : '#0d1117', border: `1px solid ${flipped ? '#22c55e' : '#1f2937'}`, borderRadius: 12, padding: '24px 20px', cursor: 'pointer', minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'all 0.2s' }}>
      <div style={{ fontSize: 11, color: '#4ade80', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>{flipped ? 'Answer' : 'Question — tap to flip'}</div>
      <div style={{ fontSize: 15, color: flipped ? '#86efac' : '#e5e7eb', lineHeight: 1.6 }}>{flipped ? card.a : card.q}</div>
    </div>
  )
}

function Output({ data }) {
  const [tab, setTab] = useState('summary')
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#22c55e' : 'transparent', color: tab === t ? '#000' : '#6b7280', border: `1px solid ${tab === t ? '#22c55e' : '#374151'}`, borderRadius: 6, padding: '5px 14px', fontSize: 12, cursor: 'pointer', fontWeight: tab === t ? 700 : 400, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'inherit' }}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
      <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 12, padding: 24 }}>
        {tab === 'summary' && <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: 15 }}>{data.summary}</p>}
        {tab === 'concepts' && <ul style={{ listStyle: 'none', padding: 0 }}>{data.concepts.map((c, i) => <li key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}><span style={{ color: '#22c55e', fontWeight: 900, fontSize: 13, minWidth: 24 }}>0{i+1}</span><span style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7 }}>{c}</span></li>)}</ul>}
        {tab === 'questions' && <ul style={{ listStyle: 'none', padding: 0 }}>{data.questions.map((q, i) => <li key={i} style={{ borderLeft: '2px solid #f59e0b', paddingLeft: 16, marginBottom: 16, color: '#fcd34d', fontSize: 14, lineHeight: 1.7 }}>{q}</li>)}</ul>}
        {tab === 'flashcards' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>{data.flashcards.map((card, i) => <Flashcard key={i} card={card} />)}</div>}
        {tab === 'memorize' && <div style={{ background: '#0a1f0a', border: '1px solid #14532d', borderRadius: 10, padding: '20px 22px', color: '#86efac', fontSize: 15, lineHeight: 1.8, fontFamily: 'monospace' }}>{data.memTip}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const outputRef = useRef(null)

  useEffect(() => {
    async function checkUser() {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      const { data } = await supabase.auth.getUser()
      if (!data.user) window.location.href = '/login'
      else setUser(data.user)
    }
    checkUser()
  }, [])

  async function handleSubmit() {
    if (!input.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/study', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setResult(data)
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  async function handleLogout() {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #1f2937', borderTopColor: '#22c55e', borderRadius: '50%' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#08080899', backdropFilter: 'blur(12px)', borderBottom: '1px solid #111', padding: '0 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#f3f4f6' }}>Lock<span style={{ color: '#22c55e' }}>In</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</span>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Sign out</button>
          </div>
        </div>
      </nav>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f3f4f6', marginBottom: 8 }}>What are you studying?</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 32 }}>Paste your notes or type a topic. Get your crash course in seconds.</p>
        <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste notes, textbook content, or type a topic..." rows={6}
            style={{ width: '100%', background: 'transparent', border: 'none', color: '#e5e7eb', fontSize: 15, lineHeight: 1.7, padding: '20px 20px 12px', resize: 'none', fontFamily: 'inherit', outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px 14px' }}>
            <span style={{ fontSize: 12, color: '#374151' }}>{input.length > 0 ? `${input.length} characters` : 'Free — unlimited sessions'}</span>
            <button onClick={handleSubmit} disabled={loading || !input.trim()}
              style={{ background: input.trim() && !loading ? '#22c55e' : '#1a2e1a', color: input.trim() && !loading ? '#000' : '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, padding: '10px 22px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
              {loading ? 'Locking in...' : 'Generate LockIn Guide →'}
            </button>
          </div>
        </div>
        {loading && <div style={{ textAlign: 'center', padding: '40px 0' }}><p style={{ color: '#6b7280', fontSize: 13 }}>Analyzing your notes...</p></div>}
        {error && <div style={{ background: '#1f0a0a', border: '1px solid #7f1d1d', borderRadius: 10, padding: '14px 18px', color: '#fca5a5', fontSize: 14, marginTop: 16 }}>{error}</div>}
        <div ref={outputRef}>{result && <Output data={result} />}</div>
      </main>
    </div>
  )
}