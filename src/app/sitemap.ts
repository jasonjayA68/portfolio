/**
 * /sitemap.xml — a list of every page, so search engines find them all.
 * The file name is a Next.js rule; Next.js turns the array below into XML.
 * New projects in src/data/projects.ts are added automatically.
 */
import type { MetadataRoute } from 'next'
import { navLinks } from '@/data/navigation'
import { projects } from '@/data/projects'
import { siteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [{ path: '/', priority: 1 }, ...navLinks.map((link) => ({ path: link.href, priority: 0.8 }))]
  const projectPages = projects.map((project) => ({ path: `/projects/${project.slug}`, priority: 0.6 }))

  return [...pages, ...projectPages].map(({ path, priority }) => ({
    url: `${siteUrl}${path === '/' ? '' : path}`,
    changeFrequency: 'monthly',
    priority,
  }))
}
