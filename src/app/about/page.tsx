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
  description: `About ${site.name}, a full-stack web developer from the Philippines with 5+ years building WordPress, Shopify and Laravel websites for agencies and clients worldwide.`,
  path: '/about',
})

const highlights = [
  { title: 'Full-stack expertise', text: 'Front-end to back-end — PHP, Laravel, JS and modern CMS platforms.' },
  { title: 'E-commerce specialist', text: 'Shopify, WooCommerce, Shopify Hydrogen and Liquid theme development.' },
  { title: 'Reliable delivery', text: 'Clear communication, on-time launches, long-term agency partnerships.' },
]

export default function AboutPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader number="01" eyebrow="about" title="A designer who codes — with an eye for detail." as="h1" />

          <div className="about-grid">
            <div className="about-text reveal">
              <p>
                With 5 years of solid experience in web development, I&apos;m a versatile and skilled Full-Stack
                Developer. I&apos;m deeply passionate about my work and committed to continuous learning — always
                focusing on what truly matters to deliver meaningful results for my clients.
              </p>
              <p>
                I&apos;ve shipped live sites across WordPress, Shopify, Laravel and custom front-end builds —
                partnering with agencies and direct clients across Australia, Canada, Ireland and beyond to bridge
                the gap between design and code.
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
              <p className="profile-role">{site.role} · AI-assisted</p>
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
                  <dd>WordPress &amp; Shopify</dd>
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
