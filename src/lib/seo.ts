/**
 * SEO helpers, used by layout.tsx, every page's `metadata`, sitemap.ts and robots.ts.
 * Server-only: browsers never load this file.
 */
import type { Metadata } from 'next'
import { site } from '@/data/site'

/**
 * The site's public address, e.g. "https://yourname.vercel.app".
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically on every build (it becomes
 * your custom domain once you add one). NEXT_PUBLIC_SITE_URL can override it.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const keywords = [
  'Jason Jay Ababao',
  'full-stack web developer',
  'freelance web developer',
  'web developer Philippines',
  'WordPress developer',
  'Elementor developer',
  'WooCommerce developer',
  'Shopify developer',
  'Shopify Liquid',
  'Laravel developer',
  'PHP developer',
  'website design',
  'e-commerce website',
  'conversion-focused websites',
  'SEO-friendly websites',
  'HubSpot',
  'GoHighLevel',
  'AI-assisted development',
]

type PageSeo = {
  title: string
  description: string
  path: string // e.g. "/about"
}

/**
 * Builds the metadata for one page:
 *   export const metadata = pageMetadata({ title: 'About', description: '…', path: '/about' })
 *
 * - canonical: tells Google the one "real" address of the page
 *   (so /projects?filter=shopify isn't treated as a duplicate of /projects)
 * - openGraph / twitter: the preview card when the link is shared on social media.
 *   The image itself comes from src/app/opengraph-image.tsx.
 */
export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  const fullTitle = `${title} · ${site.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    // A page's openGraph/twitter settings REPLACE the layout's (they aren't merged),
    // so the share image has to be listed again here or it disappears.
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: 'en_US',
      url: path,
      title: fullTitle,
      description,
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [shareImage.url],
    },
  }
}

/** The image drawn by src/app/opengraph-image.tsx */
export const shareImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.role}`,
}

/** Structured data (JSON-LD): describes you to search engines as a Person. */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    description: site.description,
    url: siteUrl,
    image: `${siteUrl}/assets/jason-jay.jpg`,
    email: `mailto:${site.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Naawan',
      addressRegion: 'Misamis Oriental',
      addressCountry: 'PH',
    },
    sameAs: [site.githubUrl, site.linkedinUrl, site.facebookUrl].filter(Boolean),
    knowsAbout: ['WordPress', 'Elementor', 'WooCommerce', 'Shopify', 'Liquid', 'Laravel', 'PHP', 'JavaScript', 'SEO', 'HubSpot', 'GoHighLevel'],
  }
}
