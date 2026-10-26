/**
 * ROUTE: /about
 * File location = URL:  src/app/about/page.tsx  ->  /about
 */
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/data/site'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { NextPageLink } from '@/components/ui/NextPageLink'

// Sets the <title> of this page: "About · Jason Jay Ababao" (see the template in layout.tsx)
export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: `About ${site.name}, an AI integration developer from the Philippines with 5+ years building WordPress, Shopify and Laravel sites, now adding AI assistants and lead automations.`,
  path: '/about',
})

const highlights = [
  { title: 'AI integration', text: 'LLM APIs, RAG, MCP' },
  { title: 'Web platforms', text: 'WordPress, WooCommerce, Shopify, Laravel' },
  { title: 'Lead systems', text: 'HubSpot, GoHighLevel, n8n' },
]

export default function AboutPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader number="01" eyebrow="about" title="A web developer who learned to make websites think." as="h1" />

          <div className="about-grid">
            <div className="about-text reveal">
              <p>
                I&apos;ve spent 5+ years building WordPress, Shopify and Laravel sites for agencies and brands in
                Australia, Canada and Ireland: tour operators, online stores, a dialysis clinic, a real-estate
                brokerage. Along the way I learned SEO, design and CRM setup in HubSpot and GoHighLevel.
              </p>
              <p>
                Now I combine all of it with AI. I build assistants that answer customers from a business&apos;s own
                content, and automations that make sure no lead is ever forgotten. I use AI coding tools every day,
                which means faster delivery without cutting corners: every AI feature is tested on real questions
                before it goes live.
              </p>
              <p>
                I work remotely from the Philippines, overlapping with Australian and European business hours.
              </p>
              <ul className="highlights">
                {highlights.map((item) => (
                  <li className="card highlight" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="card profile hud reveal">
              <Image
                src="/assets/jason-jay.jpg"
                alt={`Portrait of ${site.name}`}
                className="profile-photo"
                width={320}
                height={320}
              />
              <h2>{site.name}</h2>
              <p className="profile-role">{site.role}</p>
              <dl className="profile-meta">
                <div>
                  <dt>location</dt>
                  <dd>{site.locationShort}</dd>
                </div>
                <div>
                  <dt>experience</dt>
                  <dd>5+ years</dd>
                </div>
                <div>
                  <dt>specialty</dt>
                  <dd>AI for WordPress &amp; Shopify</dd>
                </div>
                <div>
                  <dt>availability</dt>
                  <dd className="ok">Open for projects</dd>
                </div>
              </dl>
              <Link href="/contact" className="btn btn-primary btn-block">
                Let&apos;s work together
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <NextPageLink href="/skills" label="Skills & tools" />
    </>
  )
}
