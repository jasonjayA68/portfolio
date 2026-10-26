/**
 * ROUTE: /   (the home page)
 *
 * A Server Component (no 'use client'): it runs at build time and sends plain
 * HTML. The interactive parts (canvas, terminal, counters) are Client
 * Components imported below, and only they ship JavaScript.
 */
import Link from 'next/link'
import { site } from '@/data/site'
import { projects, getProjectBySlug, type Project } from '@/data/projects'
import { buildCards, howItWorks } from '@/data/offers'
import { placeholders } from '@/data/placeholders'
import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { BookingLink } from '@/components/ui/BookingLink'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { NeuralCanvas } from '@/components/home/NeuralCanvas'
import { AssistantTerminal } from '@/components/home/AssistantTerminal'
import { CountUp } from '@/components/home/CountUp'
import { Testimonials } from '@/components/home/Testimonials'

const SELECTED = ['go-euro-tours', 'go-irish-tours', 'your-reformer']

export default function HomePage() {
  const selected = SELECTED.map(getProjectBySlug).filter((p): p is Project => Boolean(p))
  const others = projects.filter((p) => !SELECTED.includes(p.slug))
  const stats = site.stats.filter((stat) => stat.value !== null)

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <NeuralCanvas />
        <div className="hero-glow" aria-hidden="true" />

        <div className="container hero-inner hero-solo">
          <div className="hero-copy">
            <p className="status-pill reveal">
              <span className="status-dot" />
              Booking AI projects{site.bookingMonth ? ` for ${site.bookingMonth}` : ''}
            </p>
            <h1 className="hero-title reveal">
              Your website should answer customers and capture leads{' '}
              <span className="gradient-text">while you sleep.</span>
            </h1>
            <p className="hero-tagline reveal">{site.tagline}</p>
            <div className="hero-cta reveal">
              <Link href="/lab" className="btn btn-primary magnetic">
                See AI demos <Icon name="arrow" />
              </Link>
              <BookingLink className="btn btn-ghost magnetic">Book a free 20-min call</BookingLink>
            </div>
            <dl className={`hero-stats reveal ${stats.length > 3 ? 'hero-stats-4' : ''}`}>
              {stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    <CountUp to={stat.value as number} />
                    {stat.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="container">
          <p className="client-strip client-strip-subtle reveal">
            <span className="mono-label">Also built</span>
            {others.slice(0, 8).map((project) => (
              <span key={project.slug}>{project.title}</span>
            ))}
          </p>
        </div>
      </section>

      {/* ---------- Try it live ---------- */}
      <section className="section section-tight" id="try-it">
        <div className="container try-grid">
          <SectionHeader
            number="01"
            eyebrow="try it live"
            title="Ask my AI assistant"
            subtitle="It answers from this site's own content: my services, projects and process. Ask it what you'd ask me."
          />
          <AssistantTerminal />
        </div>
      </section>

      {/* ---------- What I build ---------- */}
      <section className="section">
        <div className="container">
          <SectionHeader
            number="02"
            eyebrow="what I build"
            title="AI that works inside the site you already have."
          />
          <ul className="build-grid">
            {buildCards.map((card) => (
              <li key={card.title} className="card build-card reveal">
                <Icon name={card.icon} className="skill-icon" />
                <h3>
                  <Link href="/services" className="build-link">
                    {card.title}
                  </Link>
                </h3>
                <p>{card.text}</p>
                <span className="project-link" aria-hidden="true">
                  See services <Icon name="arrow" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Selected work ---------- */}
      <section className="section">
        <div className="container">
          <SectionHeader
            number="03"
            eyebrow="selected work"
            title="Real projects. Live websites."
            subtitle="Travel and e-commerce builds. Click a card for the case study."
          />
          <div className="projects-grid">
            {selected.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                result={placeholders.projectResults[project.slug]}
                className="reveal"
              />
            ))}
          </div>
          <div className="section-actions">
            <Link href="/projects" className="btn btn-ghost">
              See all {projects.length} projects <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section">
        <div className="container">
          <SectionHeader number="04" eyebrow="how it works" title="From first call to launch in four steps." />
          <ol className="process-grid">
            {howItWorks.map((step, i) => (
              <li className="card process reveal" key={step.title}>
                <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Testimonials (hidden until real quotes are added) ---------- */}
      <Testimonials number="05" />

      {/* ---------- Final call to action ---------- */}
      <section className="section">
        <div className="container">
          <div className="card cta-band hud reveal">
            <h2>Want to see what AI would answer on your site?</h2>
            <p>Send me your URL and I&apos;ll record a free 5-minute demo.</p>
            <Link href="/contact" className="btn btn-primary magnetic">
              Get my free demo <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
