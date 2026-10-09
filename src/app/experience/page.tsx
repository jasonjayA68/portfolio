/** ROUTE: /experience */
import type { Metadata } from 'next'
import { experience } from '@/data/experience'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NextPageLink } from '@/components/ui/NextPageLink'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Agency and freelance work history: WordPress, Shopify, SEO and graphic design.',
}

export default function ExperiencePage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader number="04" eyebrow="experience" title="A timeline of my journey." as="h1" />

          {/* The glowing line that fills as you scroll is drawn by components/effects/ScrollProgress.tsx */}
          <ol className="timeline">
            {experience.map((job) => (
              <li className="timeline-item reveal" key={job.company}>
                <time className="timeline-date">{job.dates}</time>
                <div className="card timeline-card">
                  <h2>{job.role}</h2>
                  <p className="timeline-company">{job.company}</p>
                  <p>{job.description}</p>
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
