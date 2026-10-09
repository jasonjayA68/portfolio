import Link from 'next/link'
import { Icon } from './Icon'

/**
 * The big "Next: Skills →" card at the bottom of a page,
 * so visitors can walk through the site in order.
 */
export function NextPageLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="container page-next">
      <Link href={href} className="card page-next-link">
        <span>
          <small>next page</small>
          <strong>{label}</strong>
        </span>
        <Icon name="arrow" />
      </Link>
    </div>
  )
}
