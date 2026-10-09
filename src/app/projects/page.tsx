/**
 * ROUTE: /projects   (also /projects?filter=shopify, ?filter=travel, …)
 *
 * The page itself is static. <ProjectFilter> reads ?filter=… from the URL with
 * useSearchParams(), and Next.js requires that to sit inside <Suspense>:
 *   - at build time the URL is unknown, so the `fallback` (all projects) is
 *     written into the HTML
 *   - in the browser, <ProjectFilter> takes over and applies the filter
 */
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { projects } from '@/data/projects'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NextPageLink } from '@/components/ui/NextPageLink'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilter } from '@/components/projects/ProjectFilter'

export const metadata: Metadata = {
  title: 'Selected work',
  description: 'Client websites across e-commerce, travel, wellness, healthcare and property.',
}

export default function ProjectsPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader
            number="03"
            eyebrow="selected work"
            title="Real projects. Live websites."
            subtitle="A selection of client sites I've designed, built or maintained across e-commerce, travel, wellness and professional services."
            as="h1"
          />

          <Suspense fallback={<AllProjects />}>
            <ProjectFilter />
          </Suspense>
        </div>
      </section>

      <NextPageLink href="/experience" label="Experience" />
    </>
  )
}

/** Shown until the filter loads (and to search engines): every project, unfiltered. */
function AllProjects() {
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
