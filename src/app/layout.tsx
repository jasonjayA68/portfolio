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
import { siteUrl, keywords, personJsonLd } from '@/lib/seo'
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

const homeTitle = `${site.name} — ${site.role}`
const homeDescription =
  'Full-stack web developer building fast, conversion-focused websites on WordPress, Shopify and Laravel. 14 client sites, 5+ years. Available for freelance work.'

// <title> and <meta> tags for the whole site. Each page overrides title/description
// with its own `metadata` export (see pageMetadata() in src/lib/seo.ts).
export const metadata: Metadata = {
  // Turns relative URLs like "/about" into full ones like "https://yoursite.com/about"
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s · ${site.name}`, // a page titled "About" becomes "About · Jason Jay Ababao"
  },
  description: homeDescription,
  keywords,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_US',
    url: '/',
    title: homeTitle,
    description: homeDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeDescription,
  },
  robots: { index: true, follow: true },
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
        {/* Structured data for search engines. "<" is escaped so the JSON can't break out of the tag. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, '\\u003c') }}
        />
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
