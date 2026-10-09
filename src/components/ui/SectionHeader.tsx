import type { ReactNode } from 'react'
import { DecodeText } from './DecodeText'

type SectionHeaderProps = {
  number: string // "01"
  eyebrow: string // "about"
  title: ReactNode
  subtitle?: ReactNode
  /** Use "h1" when this is the main heading of the page (one h1 per page). */
  as?: 'h1' | 'h2'
}

/**
 *   // 01  about ───
 *   A designer who codes — with an eye for detail.
 *   Optional subtitle…
 */
export function SectionHeader({ number, eyebrow, title, subtitle, as: Heading = 'h2' }: SectionHeaderProps) {
  return (
    <header className="section-head reveal">
      <p className="eyebrow">
        <span className="eyebrow-num">{number}</span> <DecodeText text={eyebrow} />
      </p>
      <Heading className="section-title">{title}</Heading>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </header>
  )
}
