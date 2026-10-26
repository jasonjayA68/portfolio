/**
 * ROUTE: /services
 * Offers, the free audit and the FAQ all come from src/data/offers.ts.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo'
import { offers, auditOffer, faqs, priceFallback } from '@/data/offers'
import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DecodeText } from '@/components/ui/DecodeText'
import { NextPageLink } from '@/components/ui/NextPageLink'

export const metadata: Metadata = pageMetadata({
  title: 'Services: AI assistants, lead automation & AI-ready websites',
  description:
    'AI website assistants, AI lead automation for HubSpot and GoHighLevel, AI-ready WordPress and Shopify builds, and an AI care plan. Start with a free AI site audit.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader
            number="03"
            eyebrow="services"
            title="AI that answers customers and follows up on every lead."
            subtitle="Four ways to work together, from a single assistant to an ongoing care plan. Every project starts with a free call and a fixed-price proposal."
            as="h1"
          />

          <ul className="offers-grid">
            {offers.map((offer) => (
              <li key={offer.slug} className={`card offer reveal ${offer.flagship ? 'offer-flagship hud' : ''}`}>
                <div className="offer-top">
                  <Icon name={offer.icon} className="skill-icon" />
                  {offer.flagship && <span className="offer-badge">flagship</span>}
                </div>
                <div>
                  <h2>{offer.name}</h2>
                  <p className="offer-for">For: {offer.forWho}</p>
                </div>
                <div>
                  <p className="offer-label">What you get</p>
                  <ul className="process-list">
                    {offer.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <dl className="offer-meta">
                  <div>
                    <dt>timeline</dt>
                    <dd>{offer.timeline}</dd>
                  </div>
                  <div>
                    <dt>starting at</dt>
                    <dd>
                      {offer.startingAt || priceFallback}
                      <small>{offer.pricingModel}</small>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <div className="card audit-banner reveal">
            <div>
              <h2>{auditOffer.title}</h2>
              <p>{auditOffer.text}</p>
            </div>
            <Link href={auditOffer.href} className="btn btn-primary magnetic">
              {auditOffer.cta} <Icon name="arrow" />
            </Link>
          </div>

          <div className="faq" id="faq">
            <header className="roadmap-head reveal">
              <p className="eyebrow">
                <span className="eyebrow-num">03.1</span> <DecodeText text="faq" />
              </p>
              <h2 className="roadmap-title">Questions clients ask first.</h2>
            </header>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question} className="card faq-item reveal">
                  <summary>
                    {faq.question}
                    <Icon name="chevron" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NextPageLink href="/projects" label="Selected work" />
    </>
  )
}
