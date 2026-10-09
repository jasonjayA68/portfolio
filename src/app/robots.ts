/**
 * /robots.txt — tells search engine crawlers what they may visit
 * and where the sitemap is. The file name is a Next.js rule.
 */
import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // the JSON endpoint isn't a page for people
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
