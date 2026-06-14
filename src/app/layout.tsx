import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.scs-uae.com'),
  title: {
    default: 'Smart Corporate Solutions | Uniform Supplier UAE',
    template: '%s | SCS UAE',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo.svg',
  },
  description:
    'Smart Corporate Solutions — premium uniform supplier in Dubai, UAE for restaurants, hotels, medical, corporate, schools, spa, industrial, and safety sectors since 2012.',
  keywords: [
    'uniform supplier UAE',
    'corporate uniform Dubai',
    'restaurant uniform UAE',
    'medical uniform Dubai',
    'school uniform UAE',
    'SCS UAE',
    'Smart Corporate Solutions',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://www.scs-uae.com',
    siteName: 'Smart Corporate Solutions',
    images: [
      {
        url: 'https://static.wixstatic.com/media/bf2fa2_c6979696eaa14393ac2a7bc852bdb3b5~mv2.jpg',
        width: 1200,
        height: 630,
        alt: 'SCS UAE — Uniform Supplier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Corporate Solutions | Uniform Supplier UAE',
    description: 'Premium uniform supplier in Dubai, UAE since 2012.',
  },
  robots: { index: true, follow: true },
  verification: { google: 'GKCeN6S-eKzFZVlQAU1eIjQn0w6wGbS39Wd67hAg5Zc' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
