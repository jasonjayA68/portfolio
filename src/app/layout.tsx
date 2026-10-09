/**
 * ROOT LAYOUT — wraps every page of the site.
 *
 * Next.js renders the current page where {children} is. The nav, footer,
 * chat and command palette are here, so they appear on every page and keep
 * their state (an open chat stays open) while you move between pages.
 */
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { site } from '@/data/site'
import { themeScript } from '@/lib/theme'
import { Providers } from '@/components/Providers'
import { Background } from '@/components/layout/Background'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/effects/ScrollProgress'
import { RevealOnScroll } from '@/components/effects/RevealOnScroll'
import { PointerEffects } from '@/components/effects/PointerEffects'
import { CommandPalette } from '@/components/palette/CommandPalette'
import { ChatPanel } from '@/components/assistant/ChatPanel'
import './globals.css'

// next/font downloads the fonts at build time and serves them from your own domain.
// `variable` exposes each font as a CSS variable; globals.css uses them in --font and --mono.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist-mono' })

// <title> and <meta> tags. Pages can override these with their own `metadata` export.
export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`, // a page titled "About" becomes "About · Jason Jay Ababao"
  },
  description: site.description,
  openGraph: {
    type: 'website',
    title: `${site.name} — ${site.role}`,
    description: 'Fast, conversion-focused websites on WordPress, Shopify and Laravel. 14 client sites, 5+ years.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0B0F',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script changes <html> attributes before React loads.
    // data-scroll-behavior: lets Next.js jump (not smooth-scroll) to the top on page changes.
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions like Grammarly add attributes to <body> */}
      <body suppressHydrationWarning>
        <Providers>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Background />
          <ScrollProgress />
          <Nav />

          <main id="main">{children}</main>

          <Footer />
          <CommandPalette />
          <ChatPanel />

          {/* Invisible helpers that add animations to the whole site */}
          <RevealOnScroll />
          <PointerEffects />
        </Providers>
      </body>
    </html>
  )
}
