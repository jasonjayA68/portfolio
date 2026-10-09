/**
 * Shown for any URL that doesn't exist, and whenever a page calls notFound()
 * (see src/app/projects/[slug]/page.tsx).
 */
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

export default function NotFound() {
  return (
    <section className="section page-top not-found">
      <div className="container">
        <p className="not-found-code gradient-text">404</p>
        <h1 className="section-title">This page doesn&apos;t exist.</h1>
        <p>The link may be old, or the address has a typo.</p>
        <Link href="/" className="btn btn-primary">
          Back to home <Icon name="arrow" />
        </Link>
      </div>
    </section>
  )
}
