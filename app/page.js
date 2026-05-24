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
 
const TESTIMONIALS = [
  { name: 'Jordan K.', school: 'UofT', text: 'I had 3 hours before my bio final. LockIn turned my messy notes into an actual study guide. Passed with a 78.', emoji: '😭' },
  { name: 'Priya S.', school: 'McMaster', text: 'Ok this is actually insane. Pasted my chem textbook chapter and got flashcards in like 10 seconds.', emoji: '💀' },
  { name: 'Marcus T.', school: 'York U', text: 'My roommate laughed at me for using an AI study tool. Then he saw my grade. He uses it now.', emoji: '💀' },
  { name: 'Aisha R.', school: 'Ryerson', text: "I've been procrastinating all semester. LockIn basically saved me from failing econ.", emoji: '😭' },
]
 
const FAQS = [
  { q: 'How does LockIn work?', a: 'Paste your notes, textbook content, or just type a topic. Our AI breaks it down into what actually matters for your test — summaries, key concepts, practice questions, and flashcards. No fluff.' },
  { q: 'Is it actually good for last-minute studying?', a: "That's literally what it's built for. Dense content gets distilled fast. You get the stuff most likely to show up on your test, not a 47-page study guide you'll never read." },
  { q: 'What subjects does it work for?', a: 'Any text-based subject — biology, history, econ, psych, law, chemistry. If you can paste the content, LockIn can break it down.' },
  { q: 'Is it free?', a: 'Yes. Free to use right now. No account needed.' },
  { q: 'Is my data private?', a: "Your notes don't get stored or used to train anything. We're not here to steal your study materials." },
]
 
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
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? '#22c55e' : 'transparent',
            color: tab === t ? '#000' : '#6b7280',
            border: `1px solid ${tab === t ? '#22c55e' : '#374151'}`,
            borderRadius: 6, padding: '5px 14px', fontSize: 12,
            cursor: 'pointer', fontWeight: tab === t ? 700 : 400,
            textTransform: 'uppercase', letterSpacing: 1,
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
      <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 12, padding: 24 }}>
        {tab === 'summary' && <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: 15 }}>{data.summary}</p>}
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
              <li key={i} style={{ borderLeft: '2px solid #f59e0b', paddingLeft: 16, marginBottom: 16, color: '#fcd34d', fontSize: 14, lineHeight: 1.7 }}>
                {q}
              </li>
            ))}
          </ul>
        )}
        {tab === 'flashcards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {data.flashcards.map((card, i) => <Flashcard key={i} card={card} />)}
          </div>
        )}
        {tab === 'memorize' && (
          <div style={{ background: '#0a1f0a', border: '1px solid #14532d', borderRadius: 10, padding: '20px 22px', color: '#86efac', fontSize: 15, lineHeight: 1.8, fontFamily: 'monospace' }}>
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
  const [openFaq, setOpenFaq] = useState(null)
  const outputRef = useRef(null)
  const inputRef = useRef(null)
 
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
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        * { box-sizing: border-box; }
        .spinner { width: 28px; height: 28px; border: 2px solid #1f2937; border-top-color: #22c55e; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .cta-btn { background: #22c55e; color: #000; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; padding: 14px 28px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .cta-btn:hover { background: #16a34a; transform: translateY(-1px); }
        .nav-link { color: #6b7280; font-size: 14px; text-decoration: none; cursor: pointer; }
        .nav-link:hover { color: #f3f4f6; }
        .testimonial { background: #0d1117; border: 1px solid #1f2937; border-radius: 12px; padding: 24px; }
        .faq-q { padding: 20px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: #e5e7eb; font-size: 15px; font-weight: 500; border: none; background: transparent; width: 100%; text-align: left; font-family: inherit; }
        .faq-q:hover { color: #22c55e; }
        @media (max-width: 640px) { .hero-h1 { font-size: 38px !important; } .flex-cols { flex-direction: column !important; } }
      `}</style>
 
      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#08080899', backdropFilter: 'blur(12px)', borderBottom: '1px solid #111', padding: '0 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>
            Lock<span style={{ color: '#22c55e' }}>In</span>
          </span>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a className="nav-link" onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}>How it works</a>
            <a className="nav-link" onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}>Pricing</a>
            <button className="cta-btn" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => inputRef.current?.scrollIntoView({ behavior: 'smooth' })}>Try it free</button>
          </div>
        </div>
      </nav>
 
      {/* HERO */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: '#14532d22', color: '#4ade80', border: '1px solid #14532d', borderRadius: 4, fontSize: 11, padding: '2px 10px', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 24 }}>
          AI Study Tool
        </span>
        <h1 className="hero-h1" style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 20, color: '#f3f4f6' }}>
          You have a test tomorrow.<br />
          <span style={{ color: '#22c55e' }}>Lock in or fail.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#9ca3af', lineHeight: 1.6, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
          Paste your notes. Get a crash course, flashcards, and the exact questions likely on your test — in seconds.
        </p>
 
        {/* INPUT */}
        <div ref={inputRef} style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Paste your notes, textbook content, or type a topic (e.g. 'the French Revolution', 'cell mitosis', 'supply and demand')..."
            rows={6}
            style={{ width: '100%', background: 'transparent', border: 'none', color: '#e5e7eb', fontSize: 15, lineHeight: 1.7, padding: '20px 20px 12px', resize: 'none', fontFamily: 'inherit', outline: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px 14px' }}>
            <span style={{ fontSize: 12, color: '#374151' }}>{input.length > 0 ? `${input.length} characters` : 'Free — no account needed'}</span>
            <button onClick={handleSubmit} disabled={loading || !input.trim()} className="cta-btn" style={{ opacity: input.trim() && !loading ? 1 : 0.4, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Locking in...' : 'Generate LockIn Guide →'}
            </button>
          </div>
        </div>
 
        {loading && <div style={{ textAlign: 'center', padding: '40px 0' }}><div className="spinner" /><p style={{ color: '#6b7280', fontSize: 13, marginTop: 14 }}>Analyzing your notes...</p></div>}
        {error && <div style={{ background: '#1f0a0a', border: '1px solid #7f1d1d', borderRadius: 10, padding: '14px 18px', color: '#fca5a5', fontSize: 14, marginTop: 16 }}>{error}</div>}
        <div ref={outputRef}>{result && <Output data={result} />}</div>
 
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
                <div key={i} style={{ background: '#0d1117', border: '1px solid #1a1a1a', borderRadius: 10, padding: 18 }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
 
      {/* HOW IT WORKS */}
      <section id="how" style={{ borderTop: '1px solid #111', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#4ade80', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>The process</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 56, color: '#f3f4f6' }}>Three steps. Zero excuses.</h2>
          <div className="flex-cols" style={{ display: 'flex', gap: 40 }}>
            {[
              { n: '01', title: 'Paste anything', body: 'Notes from class. A textbook chapter. A YouTube transcript. A topic you\'ve been ignoring all semester.' },
              { n: '02', title: 'AI does the work', body: 'We strip the fluff, find what matters, and format it for how your brain actually learns under pressure.' },
              { n: '03', title: 'Lock in and go', body: 'Scan the summary. Drill flashcards. Read the likely test questions. You\'re as ready as you\'re gonna be.' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#111', WebkitTextStroke: '1px #22c55e33', lineHeight: 1 }}>{s.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '12px 0 8px', color: '#f3f4f6' }}>{s.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* TESTIMONIALS */}
      <section style={{ borderTop: '1px solid #111', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#4ade80', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Real students</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 48, color: '#f3f4f6' }}>They were cooked. Then they weren't.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial">
                <div style={{ fontSize: 24, marginBottom: 12 }}>{t.emoji}</div>
                <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ fontSize: 12, color: '#4b5563' }}>
                  <span style={{ color: '#9ca3af', fontWeight: 600 }}>{t.name}</span> · {t.school}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* PRICING */}
      <section id="pricing" style={{ borderTop: '1px solid #111', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#4ade80', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 12, color: '#f3f4f6' }}>Less than a Red Bull.</h2>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 48 }}>And it'll actually help you pass.</p>
          <div className="flex-cols" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 16, padding: 32, flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Free</div>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1px', marginBottom: 4, color: '#f3f4f6' }}>$0</div>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 28 }}>No credit card. No excuses.</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {['Unlimited study sessions', 'Summary + key concepts', 'Flashcards', 'Test question generator'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#9ca3af', marginBottom: 10 }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="cta-btn" style={{ width: '100%', textAlign: 'center' }} onClick={() => inputRef.current?.scrollIntoView({ behavior: 'smooth' })}>Get started free</button>
            </div>
            <div style={{ background: '#0a1a0a', border: '1px solid #22c55e', borderRadius: 16, padding: 32, flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Pro</div>
                <span style={{ background: '#22c55e', color: '#000', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Coming soon</span>
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1px', marginBottom: 4, color: '#f3f4f6' }}>$7<span style={{ fontSize: 18, fontWeight: 500, color: '#6b7280' }}>/mo</span></div>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 28 }}>Less than your campus parking ticket.</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                {['Everything in free', 'Priority AI speed', 'Longer content support', 'Advanced flashcard modes', 'Memory guides + mnemonics', 'Mobile study mode'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#d1d5db', marginBottom: 10 }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="cta-btn" style={{ width: '100%', textAlign: 'center', opacity: 0.6, cursor: 'not-allowed' }}>Coming soon</button>
            </div>
          </div>
        </div>
      </section>
 
      {/* FAQ */}
      <section style={{ borderTop: '1px solid #111', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 11, color: '#4ade80', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 48, color: '#f3f4f6' }}>Questions you're probably asking at 2AM.</h2>
          <div>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid #1f2937' }}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <span style={{ color: '#374151', fontSize: 18 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.8, paddingBottom: 20 }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* CTA BANNER */}
      <section style={{ borderTop: '1px solid #111', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20, color: '#f3f4f6' }}>
            Stop reading this.<br /><span style={{ color: '#22c55e' }}>Go study.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 36 }}>Your test isn't going to wait.</p>
          <button className="cta-btn" style={{ fontSize: 16, padding: '16px 36px' }} onClick={() => inputRef.current?.scrollIntoView({ behavior: 'smooth' })}>Lock In — It's Free</button>
        </div>
      </section>
 
      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#f3f4f6' }}>Lock<span style={{ color: '#22c55e' }}>In</span></span>
          <span style={{ fontSize: 12, color: '#374151' }}>Built for the night before. © 2025 LockIn.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ fontSize: 12, color: '#374151', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ fontSize: 12, color: '#374151', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}