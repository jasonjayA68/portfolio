/**
 * ROUTE: /skills
 * One matrix: each group lists what I ship with today and what I'm building toward.
 */
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { skillGroups } from '@/data/skills'
import { Icon } from '@/components/ui/Icon'
import { Tags } from '@/components/ui/Tags'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NextPageLink } from '@/components/ui/NextPageLink'

export const metadata: Metadata = pageMetadata({
  title: 'Skills & tools',
  description:
    'AI integration, automation and CRM (HubSpot, GoHighLevel), WordPress and Shopify, PHP and Laravel, Next.js and SEO: the tools I ship with today and the AI skills I am building toward.',
  path: '/skills',
})

export default function SkillsPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader
            number="02"
            eyebrow="skills & tools"
            title="What I ship with today, and what I'm building toward."
            subtitle="AI first. The left column is in client work now; the right column is what I'm learning and adding as it matures."
            as="h1"
          />

          <div className="skill-matrix-head" aria-hidden="true">
            <span />
            <span>shipping with</span>
            <span>building toward</span>
          </div>
          <ul className="skill-matrix">
            {skillGroups.map((group) => (
              <li key={group.title} className="card skill-row reveal">
                <div className="skill-row-title">
                  <Icon name={group.icon} className="skill-icon" />
                  <h2>{group.title}</h2>
                </div>
                <div>
                  <p className="skill-col-label">shipping with</p>
                  <Tags items={group.shipping} />
                </div>
                <div className="skill-col-building">
                  <p className="skill-col-label">building toward</p>
                  <Tags items={group.building} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NextPageLink href="/services" label="Services" />
    </>
  )
}
