'use client'

/**
 * Filter chips + the filtered project grid on /projects.
 *
 * The chosen filter lives in the URL:  /projects?filter=shopify
 * That means a filtered view can be bookmarked or shared, and the browser's
 * Back button works. There's no useState: the URL IS the state.
 *
 *   useSearchParams()  -> read  ?filter=…
 *   <Link href="?…">   -> change ?filter=…
 */
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { projectFilters, getProjectsByFilter, type Project } from '@/data/projects'
import { ProjectCard } from './ProjectCard'

export function ProjectFilter() {
  const searchParams = useSearchParams()
  const requested = searchParams.get('filter') ?? 'all'

  // Ignore unknown values like ?filter=banana
  const active = projectFilters.some((f) => f.value === requested) ? requested : 'all'
  const visible = getProjectsByFilter(active)

  return (
    <>
      <div className="filter-bar reveal visible" role="toolbar" aria-label="Filter projects">
        {projectFilters.map((filter) => {
          const isActive = filter.value === active
          const href = filter.value === 'all' ? '/projects' : `/projects?filter=${filter.value}`
          return (
            <Link
              key={filter.value}
              href={href}
              scroll={false} // stay where you are on the page
              replace // don't add every click to the browser history
              className={`filter-chip ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {filter.label} <span className="filter-count">{getProjectsByFilter(filter.value).length}</span>
            </Link>
          )
        })}
      </div>

      <ProjectGrid filter={active} projects={visible} />
    </>
  )
}

function ProjectGrid({ filter, projects }: { filter: string; projects: Project[] }) {
  return (
    // Changing the `key` makes React rebuild the grid, which replays the cards' entrance animation
    <div className="projects-grid" key={filter}>
      {projects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          project={project}
          className="is-entering"
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  )
}
