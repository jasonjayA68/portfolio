/** ROUTE: /experience */
import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'
import { Icon } from '@/components/ui/Icon'
import { experience } from '@/data/experience'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NextPageLink } from '@/components/ui/NextPageLink'

export const metadata: Metadata = pageMetadata({
  title: 'Experience',
  description: 'Freelance AI integration developer since Oct 2025, after 5+ years building WordPress, Shopify and Laravel sites with agencies DG Venture and ESTRAT360.',
  path: '/experience',
})

export default function ExperiencePage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader number="06" eyebrow="experience" title="A timeline of my journey." as="h1" />

          {/* The glowing line that fills as you scroll is drawn by components/effects/ScrollProgress.tsx */}
          <ol className="timeline">
            {experience.map((job) => (
              <li className="timeline-item reveal" key={job.company}>
                <time className="timeline-date">{job.dates}</time>
                <div className="card timeline-card">
                  <h2>{job.role}</h2>
                  <p className="timeline-company">{job.company}</p>
                  <p>{job.description}</p>
                  {job.result && <p className="timeline-result">{job.result}</p>}
                  {job.link && (
                    <Link href={job.link.href} className="timeline-link">
                      {job.link.label} <Icon name="arrow" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <NextPageLink href="/process" label="How I work" />
    </>
  )
}
