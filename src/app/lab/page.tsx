/**
 * ROUTE: /lab
 * Demo cards come from src/data/lab.ts.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'
import { labDemos } from '@/data/lab'
import { Icon } from '@/components/ui/Icon'
import { Tags } from '@/components/ui/Tags'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NextPageLink } from '@/components/ui/NextPageLink'

export const metadata: Metadata = pageMetadata({
  title: 'AI Lab: AI assistant and automation demos',
  description:
    'AI demos for business websites: a live portfolio assistant, plus tour enquiry automation with HubSpot, a RAG tour assistant and a WooCommerce store copilot built on MCP.',
  path: '/lab',
})

export default function LabPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader
            number="05"
            eyebrow="ai lab"
            title="AI demos, built in the open."
            subtitle="What's live is marked live. Everything else is in progress and shows up here as it ships."
            as="h1"
          />

          <ul className="lab-grid">
            {labDemos.map((demo) => {
              const live = demo.status === 'Live'
              return (
                <li key={demo.slug} className={`card lab-card reveal ${live ? '' : 'is-progress'}`}>
                  <span className={`lab-status ${live ? '' : 'is-progress'}`}>
                    {live && <span className="status-dot" aria-hidden="true" />}
                    {demo.status}
                  </span>
                  <h2>{demo.title}</h2>
                  <p>{demo.problem}</p>
                  {demo.how && (
                    <ul className="lab-how">
                      {demo.how.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                  <Tags items={demo.stack} />
                  {live && demo.videoUrl && (
                    <div className="lab-video">
                      <iframe
                        src={demo.videoUrl}
                        title={`${demo.title} video walkthrough`}
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="lab-actions">
                    {live && demo.tryHref && (
                      <Link href={demo.tryHref} className="btn btn-ghost btn-sm">
                        {demo.tryLabel ?? 'Try it'}
                      </Link>
                    )}
                    <Link href="/contact" className="btn btn-primary btn-sm">
                      Want this on your site? <Icon name="arrow" />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <NextPageLink href="/experience" label="Experience" />
    </>
  )
}
