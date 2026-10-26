import Link from 'next/link'
import type { ReactNode } from 'react'
import { site } from '@/data/site'

/**
 * The "Book a free call" button. An external booking page (Calendly, Cal.com…)
 * opens in a new tab; the /contact fallback is a normal page link.
 */
export function BookingLink({ className, children }: { className?: string; children: ReactNode }) {
  if (site.bookingUrl.startsWith('http')) {
    return (
      <a href={site.bookingUrl} className={className} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    )
  }
  return (
    <Link href={site.bookingUrl} className={className}>
      {children}
    </Link>
  )
}
