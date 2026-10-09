import type { Skill } from '@/data/skills'
import { Icon } from './Icon'
import { Tags } from './Tags'

/** One skill card. With `learning`, it renders as a dashed roadmap card with a "learning" badge. */
export function SkillCard({ skill, learning = false }: { skill: Skill; learning?: boolean }) {
  if (learning) {
    return (
      <li className="card roadmap-card reveal">
        <div className="roadmap-top">
          <Icon name={skill.icon} className="skill-icon" />
          <span className="roadmap-status">learning</span>
        </div>
        <h3>{skill.title}</h3>
        <p>{skill.description}</p>
        <Tags items={skill.tags} />
      </li>
    )
  }

  return (
    <article className={`card skill reveal ${skill.featured ? 'skill-featured' : ''}`}>
      <Icon name={skill.icon} className="skill-icon" />
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>
      <Tags items={skill.tags} />
    </article>
  )
}
