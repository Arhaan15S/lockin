import './globals.css'

export const metadata = {
  title: 'LockIn — Last-Minute Exam Survival',
  description: 'Paste your notes. Get a crash course, flashcards, and likely test questions in seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
