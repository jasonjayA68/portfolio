/**
 * 404 PAGE
 *
 * Next.js shows this for any URL that doesn't exist, and whenever a page
 * calls notFound() (see src/app/projects/[slug]/page.tsx).
 * The file name `not-found.tsx` is a Next.js rule. The design is up to you.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { navLinks } from '@/data/navigation'
import { Icon } from '@/components/ui/Icon'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <section className="section page-top not-found">
      <div className="container not-found-inner">
        <p className="not-found-code gradient-text" aria-hidden="true">
          404
        </p>
        <h1 className="section-title">This page doesn&apos;t exist.</h1>
        <p className="not-found-text">The link may be old, or the address has a typo. Here&apos;s where you can go instead.</p>

        {/* Same look as the hero terminal, as a little joke for developers */}
        <div className="terminal not-found-terminal" aria-hidden="true">
          <div className="terminal-body">
            <p className="t-line t-cmd">
              <span className="t-prompt">$</span> cd requested-page
            </p>
            <p className="t-line">
              <span className="t-key">error</span> no such page
            </p>
          </div>
        </div>

        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            Back to home <Icon name="arrow" />
          </Link>
          <Link href="/projects" className="btn btn-ghost">
            View projects
          </Link>
        </div>

        {/* Every main page, built from the same list as the nav menu */}
        <nav aria-label="Pages">
          <ul className="not-found-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="card not-found-link">
                  <small>{link.number}</small>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
