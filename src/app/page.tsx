/**
 * ROUTE: /   (the home page)
 *
 * A Server Component (no 'use client'): it runs at build time and sends plain
 * HTML. The interactive parts (canvas, terminal, counters) are Client
 * Components imported below, and only they ship JavaScript.
 */
import Link from 'next/link'
import { site } from '@/data/site'
import { getFeaturedProjects, projects, displayDomain } from '@/data/projects'
import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { NeuralCanvas } from '@/components/home/NeuralCanvas'
import { HeroTerminal } from '@/components/home/HeroTerminal'
import { CountUp } from '@/components/home/CountUp'

export default function HomePage() {
  const featured = getFeaturedProjects()

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <NeuralCanvas />
        <div className="hero-glow" aria-hidden="true" />

        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="status-pill reveal">
              <span className="status-dot" />
              Available for freelance work
            </p>
            <h1 className="hero-title reveal">
              Crafting digital <span className="gradient-text">experiences</span> that convert.
            </h1>
            <p className="hero-name reveal">
              <span className="mono">{site.name}</span> · {site.role} ·{' '}
              <span className="accent-text">AI-assisted workflow</span>
            </p>
            <p className="hero-tagline reveal">{site.tagline}</p>
            <div className="hero-cta reveal">
              <Link href="/projects" className="btn btn-primary magnetic">
                View projects <Icon name="arrow" />
              </Link>
              <Link href="/contact" className="btn btn-ghost magnetic">
                Contact me
              </Link>
            </div>
            <dl className="hero-stats reveal">
              {site.stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    <CountUp to={stat.value} />
                    {stat.suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroTerminal />
        </div>

        <div className="container">
          <p className="client-strip reveal">
            <span className="mono-label">Shipped for</span>
            {projects.slice(0, 9).map((project) => (
              <span key={project.slug}>{displayDomain(project.url)}</span>
            ))}
          </p>
        </div>
      </section>

      {/* ---------- Featured work ---------- */}
      <section className="section">
        <div className="container">
          <SectionHeader
            number="03"
            eyebrow="selected work"
            title="Real projects. Live websites."
            subtitle="A few recent client sites. Click a card for the details."
          />
          <div className="projects-grid">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} className="reveal" />
            ))}
          </div>
          <div className="section-actions">
            <Link href="/projects" className="btn btn-ghost">
              See all {projects.length} projects <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Quote ---------- */}
      <section className="quote" aria-label="Working principle">
        <div className="container">
          <figure className="quote-inner reveal">
            <blockquote>
              Good design is honest. It&apos;s <em>obvious</em> once you see it, but takes <em>discipline</em> to
              ship.
            </blockquote>
            <figcaption className="mono">{'// my north star, on every project'}</figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
