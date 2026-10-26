/**
 * ROUTE: /projects/[slug]   (a DYNAMIC route)
 *
 * The folder name in square brackets, [slug], is a placeholder. One file
 * makes a page for every project:
 *   /projects/curakidney      -> slug = "curakidney"
 *   /projects/your-reformer   -> slug = "your-reformer"
 *
 * Three special exports:
 *   generateStaticParams()  which slugs to build ahead of time
 *   generateMetadata()      the <title> for each project
 *   default (the page)      the content
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { projects, getProjectBySlug, displayDomain } from '@/data/projects'
import { getCaseStudy, type CaseStudy } from '@/data/caseStudies'
import { pageMetadata } from '@/lib/seo'
import { Icon } from '@/components/ui/Icon'
import { Tags } from '@/components/ui/Tags'
import { DecodeText } from '@/components/ui/DecodeText'

// In Next.js 16, `params` is a Promise, so it is awaited before use
type Props = {
  params: Promise<{ slug: string }>
}

/** Build one static page per project at build time: [{ slug: 'curakidney' }, …] */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

/** Each project page gets its own title and description */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Project not found' }
  return pageMetadata({
    title: `${project.title} — ${project.tags.join(', ')} project`,
    description: project.summary,
    path: `/projects/${project.slug}`,
  })
}

/**
 * The page is split in two:
 *   - the outer part doesn't depend on the URL, so it shows instantly when a card is clicked
 *   - <ProjectDetails> reads the slug from the URL, so it sits inside <Suspense>.
 *     All 14 pages are prebuilt, so visitors almost never see the fallback.
 */
export default function ProjectPage({ params }: Props) {
  return (
    <section className="section page-top">
      <div className="container">
        <Link href="/projects" className="back-link">
          <Icon name="back" /> All projects
        </Link>

        <Suspense fallback={<p className="mono">Loading project…</p>}>
          <ProjectDetails params={params} />
        </Suspense>
      </div>
    </section>
  )
}

async function ProjectDetails({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  // Unknown slug (e.g. /projects/banana) -> show src/app/not-found.tsx
  if (!project) notFound()

  // Previous / next project, wrapping around at the ends
  const index = projects.indexOf(project)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const caseStudy = getCaseStudy(project.slug)

  return (
    <>
      <header className="section-head reveal">
        <p className="eyebrow">
          <span className="eyebrow-num">04.{String(index + 1).padStart(2, '0')}</span>{' '}
          <DecodeText text="case study" />
        </p>
        <h1 className="section-title">{project.title}</h1>
      </header>

      <div className="detail-grid">
        <div className="card detail-shot reveal">
          <Image
            src={project.image}
            alt={`${project.title} homepage`}
            width={1440}
            height={900}
            sizes="(max-width: 900px) 100vw, 640px"
            priority // the main image of the page: load it first
          />
        </div>

        <aside className="card detail-info hud reveal">
          <p className="detail-summary">{project.summary}</p>
          <dl className="profile-meta">
            <div>
              <dt>website</dt>
              <dd>
                {displayDomain(project.url)}
                {project.offlineNote && ' (offline)'}
              </dd>
            </div>
            <div>
              <dt>platform</dt>
              <dd>{project.platforms.join(' · ')}</dd>
            </div>
            <div>
              <dt>industry</dt>
              <dd>{project.industries.join(' · ')}</dd>
            </div>
            {/* Only shown when the project has an agency */}
            {project.agency && (
              <div>
                <dt>built with</dt>
                <dd>{project.agency}</dd>
              </div>
            )}
          </dl>
          <Tags items={project.tags} />
          {/* A project is either still online (show the button) or not (show why) */}
          {project.offlineNote ? (
            <p className="detail-note">{project.offlineNote}</p>
          ) : (
            <a href={project.url} className="btn btn-primary btn-block" target="_blank" rel="noopener noreferrer">
              Visit live site <Icon name="external" />
            </a>
          )}
        </aside>
      </div>

      {/* Go Euro Tours, Go Irish Tours and Your Reformer get the full case study */}
      {caseStudy && <CaseStudySections study={caseStudy} />}

      <nav className="detail-pager" aria-label="More projects">
        <Link href={`/projects/${previous.slug}`} className="card">
          <small>← previous</small>
          <strong>{previous.title}</strong>
        </Link>
        <Link href={`/projects/${next.slug}`} className="card">
          <small>next →</small>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </>
  )
}

/**
 * Client and goal → The problem → What I built → Results → Quote + call to action,
 * then the "AI upgrade" callout. Sections without real content yet are skipped,
 * and the step numbers close up so there are no gaps.
 */
function CaseStudySections({ study }: { study: CaseStudy }) {
  const blocks = [
    { title: 'Client and goal', content: <p>{study.goal}</p> },
    study.problem && { title: 'The problem', content: <p>{study.problem}</p> },
    {
      title: 'What I built',
      content: (
        <ul>
          {study.built.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
    study.results.length > 0 && {
      title: 'Results',
      content: (
        <ul>
          {study.results.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
  ].filter((block): block is { title: string; content: React.JSX.Element } => Boolean(block))

  return (
    <div className="case">
      {blocks.map((block, i) => (
        <section key={block.title} className="card case-block reveal">
          <h2 data-step={String(i + 1).padStart(2, '0')}>{block.title}</h2>
          {block.content}
        </section>
      ))}

      {study.quote && (
        <figure className="card case-block case-quote reveal">
          <blockquote>{study.quote.text}</blockquote>
          <figcaption>
            {study.quote.name}, {study.quote.role}, {study.quote.company}
          </figcaption>
        </figure>
      )}

      <div className="case-cta reveal">
        <Link href="/contact" className="btn btn-primary magnetic">
          Want something like this? <Icon name="arrow" />
        </Link>
      </div>

      <aside className="card ai-callout reveal" aria-label="AI upgrade">
        <Icon name="spark" />
        <div>
          <strong>AI upgrade</strong>
          <p>{study.aiUpgrade}</p>
        </div>
      </aside>
    </div>
  )
}
