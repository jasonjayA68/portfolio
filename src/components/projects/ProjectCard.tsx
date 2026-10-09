import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Project } from '@/data/projects'
import { Icon } from '@/components/ui/Icon'
import { Tags } from '@/components/ui/Tags'

type ProjectCardProps = {
  project: Project
  className?: string // e.g. "reveal" or "is-entering"
  style?: CSSProperties
}

/**
 * One project in a grid.
 * Clicking anywhere on the card opens /projects/<slug> (the title link is stretched
 * over the card in CSS). The "Live site" link sits on top and opens the real website.
 */
export function ProjectCard({ project, className = '', style }: ProjectCardProps) {
  return (
    <article className={`card project ${className}`} style={style}>
      <div className="project-shot">
        {/* next/image resizes and lazy-loads the screenshot automatically */}
        <Image
          src={project.image}
          alt={`${project.title} homepage`}
          width={1440}
          height={900}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        />
      </div>
      <div className="project-body">
        <h3>
          <Link href={`/projects/${project.slug}`} className="project-title-link">
            {project.title}
          </Link>
        </h3>
        <p>{project.summary}</p>
        <Tags items={project.tags} />
        {project.offlineNote ? (
          // Your version isn't online anymore, so don't send visitors to someone else's site
          <span className="project-link project-link-muted">No longer online</span>
        ) : (
          <a href={project.url} className="project-link" target="_blank" rel="noopener noreferrer">
            Live site<span className="sr-only"> — {project.title} (opens in new tab)</span> <Icon name="external" />
          </a>
        )}
      </div>
    </article>
  )
}
