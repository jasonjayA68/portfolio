/** ROUTE: /process */
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { processSteps } from '@/data/process'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NextPageLink } from '@/components/ui/NextPageLink'

export const metadata: Metadata = pageMetadata({
  title: 'Process',
  description: 'How a website project runs: free discovery call, written scope, design mockups, development, QA, SEO setup, launch and handover.',
  path: '/process',
})

export default function ProcessPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader
            number="05"
            eyebrow="how I work"
            title="A clear process, no surprises."
            subtitle="From first call to launch day — a calm, organized workflow that keeps clients in the loop and projects on time."
            as="h1"
          />

          <ol className="process-grid">
            {processSteps.map((step, i) => (
              <li className="card process reveal" key={step.title}>
                {/* i starts at 0, so step 1 is i + 1. padStart turns "1" into "01". */}
                <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
                <ul className="process-list">
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <NextPageLink href="/contact" label="Get in touch" />
    </>
  )
}
