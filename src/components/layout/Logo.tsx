import Link from 'next/link'

/** The "jj Jason Jay Ababao" logo. Links to the home page. Used in the nav and footer. */
export function Logo({ label = 'Jason Jay Ababao — home' }: { label?: string }) {
  return (
    <Link href="/" className="logo" aria-label={label}>
      <span className="logo-mark" aria-hidden="true">
        jj
      </span>
      <span className="logo-text">
        Jason Jay <span className="logo-dim">Ababao</span>
      </span>
    </Link>
  )
}
