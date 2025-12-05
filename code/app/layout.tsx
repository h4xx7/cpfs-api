import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'; // Importa a fonte 'Geist' (sans-serif)
import { GeistMono } from 'geist/font/mono'; // Importa a fonte 'Geist Mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
// Configurando as fontes
const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
