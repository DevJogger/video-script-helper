import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Mono } from 'next/font/google'
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

const notoSansMono = Noto_Sans_Mono({
  variable: '--font-noto-sans-mono',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansMono.variable} antialiased`}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
