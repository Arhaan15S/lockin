import './globals.css'

export const metadata = {
  title: 'LockIn — Last-Minute Exam Survival',
  description: 'Paste your notes. Get a crash course survival guide in seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BFLNHZCQP6"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BFLNHZCQP6');
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}