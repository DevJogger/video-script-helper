import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_TC, Noto_Sans_SC } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { StoreProvider } from '@/model/store-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
})

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
})

const sarasaMonoTC = localFont({
  src: [
    {
      path: '../public/fonts/sarasa/SarasaMonoTC-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/sarasa/SarasaMonoTC-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/sarasa/SarasaMonoTC-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/sarasa/SarasaMonoTC-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-sarasa',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Video Script Helper',
  description: 'A tool to format video scripts efficiently',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${notoSansSC.variable} ${sarasaMonoTC.variable} antialiased`}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
