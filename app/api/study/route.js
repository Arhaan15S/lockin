import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { input, userId } = await request.json()

    if (!input || input.trim().length < 3) {
      return Response.json({ error: 'Please enter some content to study.' }, { status: 400 })
    }

    // Check usage limits if user is logged in
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single()

      if (profile && profile.plan === 'free') {
        const currentMonth = new Date().toISOString().slice(0, 7)
        const { count } = await supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('month', currentMonth)

        if (count >= 5) {
          return Response.json({ error: 'Free limit reached. Upgrade to Pro for unlimited sessions.', limitReached: true }, { status: 403 })
        }

        // Log this session
        await supabase.from('sessions').insert({
          user_id: userId,
          month: currentMonth,
        })
      }
    }

    const prompt = `You are LockIn, an AI study assistant for students cramming before exams.

The student gave you this content:
"""
${input}
"""

Return ONLY a valid JSON object. No markdown. No explanation. No backticks. Just raw JSON.

Use this exact structure:
{
  "summary": "2-3 sentence crash course. Simple, direct, no fluff.",
  "concepts": [
    "Concept 1 — with a memory hook or why it matters",
    "Concept 2 — with a memory hook or why it matters",
    "Concept 3 — with a memory hook or why it matters",
    "Concept 4 — with a memory hook or why it matters",
    "Concept 5 — with a memory hook or why it matters"
  ],
  "questions": [
    "Likely exam question 1?",
    "Likely exam question 2?",
    "Likely exam question 3?",
    "Likely exam question 4?",
    "Likely exam question 5?"
  ],
  "flashcards": [
    { "q": "Question", "a": "Answer" },
    { "q": "Question", "a": "Answer" },
    { "q": "Question", "a": "Answer" },
    { "q": "Question", "a": "Answer" }
  ],
  "memTip": "One sentence mnemonic, acronym, or trick to remember the core concept."
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content.map(b => b.text || '').join('')
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return Response.json(parsed)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 500 })
  }
}