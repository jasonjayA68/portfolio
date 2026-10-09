/**
 * ROUTE: /contact
 * The page is a Server Component; the form and the "ask" card are small
 * Client Components because they react to typing and clicks.
 */
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/data/site'
import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ContactForm } from '@/components/contact/ContactForm'
import { AskAssistantCard } from '@/components/assistant/AskAssistantCard'

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: `Hire ${site.name} for a new website, redesign or ongoing maintenance. Send a message, email or WhatsApp. Available for freelance projects.`,
  path: '/contact',
})

export default function ContactPage() {
  return (
    <section className="section page-top">
      <div className="container">
        <SectionHeader
          number="06"
          eyebrow="get in touch"
          title="Let's build something great."
          subtitle="Have a project in mind or need a website refresh? I'd love to hear about it."
          as="h1"
        />

        <div className="contact-grid">
          <div className="contact-info reveal">
            <ul className="contact-list">
              <li>
                <a href={`mailto:${site.email}`} className="card contact-item">
                  <Icon name="mail" />
                  <span>
                    <span className="contact-label">email</span>
                    {site.email}
                  </span>
                </a>
              </li>
              <li>
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="card contact-item">
                  <Icon name="whatsapp" />
                  <span>
                    <span className="contact-label">whatsapp</span>
                    {site.whatsappNumber}
                  </span>
                </a>
              </li>
              <li>
                <div className="card contact-item">
                  <Icon name="pin" />
                  <span>
                    <span className="contact-label">location</span>
                    {site.location}
                  </span>
                </div>
              </li>
            </ul>

            {/* Each icon only renders when its URL is filled in src/data/site.ts */}
            <ul className="socials" aria-label="Social profiles">
              {site.linkedinUrl && (
                <li>
                  <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
                    <Icon name="linkedin" />
                  </a>
                </li>
              )}
              <li>
                <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-btn">
                  <Icon name="github" />
                </a>
              </li>
              {site.facebookUrl && (
                <li>
                  <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="icon-btn">
                    <Icon name="facebook" />
                  </a>
                </li>
              )}
            </ul>

            <AskAssistantCard />
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}
