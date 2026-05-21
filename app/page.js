'use client'

import { useState, useRef } from 'react'

const TABS = ['summary', 'concepts', 'questions', 'flashcards', 'memorize']
const TAB_LABELS = {
  summary: 'Summary',
  concepts: 'Key Concepts',
  questions: 'Test Qs',
  flashcards: 'Flashcards',
  memorize: 'Memorize',
}

function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{
        background: flipped ? '#0f2a0f' : '#0d1117',
        border: `1px solid ${flipped ? '#22c55e' : '#1f2937'}`,
        borderRadius: 12,
        padding: '24px 20px',
        cursor: 'pointer',
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ fontSize: 11, color: '#4ade80', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
        {flipped ? 'Answer' : 'Question — tap to flip'}
      </div>
      <div style={{ fontSize: 15, color: flipped ? '#86efac' : '#e5e7eb', lineHeight: 1.6 }}>
        {flipped ? card.a : card.q}
      </div>
    </div>
  )
}

function Output({ data }) {
  const [tab, setTab] = useState('summary')

  return (
    <div className="fade-up" style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ height: 1, flex: 1, background: '#1f2937' }} />
        <span style={{ fontSize: 11, color: '#4b5563', letterSpacing: 2, textTransform: 'uppercase' }}>LockIn Output</span>
        <div style={{ height: 1, flex: 1, background: '#1f2937' }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? '#22c55e' : 'transparent',
              color: tab === t ? '#000' : '#6b7280',
              border: `1px solid ${tab === t ? '#22c55e' : '#374151'}`,
              borderRadius: 6,
              padding: '5px 14px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: tab === t ? 700 : 400,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 12, padding: 24 }}>
        {tab === 'summary' && (
          <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: 15 }}>{data.summary}</p>
        )}

        {tab === 'concepts' && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.concepts.map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ color: '#22c55e', fontWeight: 900, fontSize: 13, minWidth: 24, marginTop: 2 }}>0{i + 1}</span>
                <span style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7 }}>{c}</span>
              </li>
            ))}
          </ul>
        )}

        {tab === 'questions' && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.questions.map((q, i) => (
              <li key={i} style={{
                borderLeft: '2px solid #f59e0b',
                paddingLeft: 16,
                marginBottom: 16,
                color: '#fcd34d',
                fontSize: 14,
                lineHeight: 1.7,
              }}>
                {q}
              </li>
            ))}
          </ul>
        )}

        {tab === 'flashcards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {data.flashcards.map((card, i) => (
              <Flashcard key={i} card={card} />
            ))}
          </div>
        )}

        {tab === 'memorize' && (
          <div style={{
            background: '#0a1f0a',
            border: '1px solid #14532d',
            borderRadius: 10,
            padding: '20px 22px',
            color: '#86efac',
            fontSize: 15,
            lineHeight: 1.8,
            fontFamily: 'monospace',
          }}>
            {data.memTip}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const outputRef = useRef(null)

  async function handleSubmit() {
    if (!input.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setResult(data)
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808' }}>
      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#08080899', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #111', padding: '0 24px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', height: 52 }}>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>
            Lock<span style={{ color: '#22c55e' }}>In</span>
          </span>
        </div>
      </nav>

      {/* HERO */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block',
            background: '#14532d22', color: '#4ade80',
            border: '1px solid #14532d', borderRadius: 4,
            fontSize: 11, padding: '2px 10px',
            letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
            marginBottom: 24,
          }}>
            AI Study Tool
          </span>
          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 58px)',
            fontWeight: 900, lineHeight: 1.08,
            letterSpacing: '-2px', marginBottom: 20,
          }}>
            You have a test tomorrow.<br />
            <span style={{ color: '#22c55e' }}>Lock in or fail.</span>
          </h1>
          <p style={{ fontSize: 17, color: '#9ca3af', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
            Paste your notes, a textbook chapter, or just type a topic. Get a crash course survival guide in seconds.
          </p>
        </div>

        {/* INPUT */}
        <div style={{
          background: '#0d1117',
          border: '1px solid #1f2937',
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: 12,
          transition: 'border-color 0.2s',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Paste your notes, textbook content, or type a topic (e.g. 'the French Revolution', 'cell mitosis', 'supply and demand')..."
            rows={6}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#e5e7eb',
              fontSize: 15,
              lineHeight: 1.7,
              padding: '20px 20px 12px',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px 14px' }}>
            <span style={{ fontSize: 12, color: '#374151' }}>
              {input.length > 0 ? `${input.length} characters` : 'Cmd+Enter to generate'}
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? '#22c55e' : '#1a2e1a',
                color: input.trim() && !loading ? '#000' : '#374151',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                padding: '10px 22px',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                letterSpacing: 0.3,
              }}
            >
              {loading ? 'Locking in...' : 'Generate LockIn Guide →'}
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" />
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 14 }}>Analyzing your notes...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{
            background: '#1f0a0a', border: '1px solid #7f1d1d',
            borderRadius: 10, padding: '14px 18px',
            color: '#fca5a5', fontSize: 14, marginTop: 16,
          }}>
            {error}
          </div>
        )}

        {/* OUTPUT */}
        <div ref={outputRef}>
          {result && <Output data={result} />}
        </div>

        {/* EMPTY STATE FEATURE GRID */}
        {!result && !loading && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ height: 1, flex: 1, background: '#111' }} />
              <span style={{ fontSize: 11, color: '#374151', letterSpacing: 2, textTransform: 'uppercase' }}>What you get</span>
              <div style={{ height: 1, flex: 1, background: '#111' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { icon: '📋', label: 'Crash Course', desc: 'Dense content simplified into what actually matters' },
                { icon: '🎯', label: 'Key Concepts', desc: '5 things you must know, with memory hooks' },
                { icon: '❓', label: 'Test Questions', desc: 'What professors actually ask — practice first' },
                { icon: '🃏', label: 'Flashcards', desc: 'Tap to flip. Drill fast. Repeat what you miss.' },
              ].map((f, i) => (
                <div key={i} style={{
                  background: '#0d1117', border: '1px solid #1a1a1a',
                  borderRadius: 10, padding: '18px',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: '#374151' }}>
          Lock<span style={{ color: '#22c55e' }}>In</span> — Built for the night before. © 2025
        </span>
      </footer>
    </div>
  )
}
