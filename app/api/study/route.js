import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  try {
    const { input } = await request.json()

    if (!input || input.trim().length < 3) {
      return Response.json({ error: 'Please enter some content to study.' }, { status: 400 })
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
