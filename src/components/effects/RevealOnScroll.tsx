'use client'

/**
 * Fades in every element with the class "reveal" as it scrolls into view.
 *
 * It renders nothing. It lives once in the root layout and, after every
 * page change (when the pathname changes), it looks for new `.reveal`
 * elements and watches them with an IntersectionObserver.
 *
 * Usage anywhere:  <div className="card reveal">…</div>
 */
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { prefersReducedMotion } from '@/lib/motion'

export function RevealOnScroll() {
  const pathname = usePathname()

  useEffect(() => {
    // The inline theme script adds this class; React can remove it in development, so add it back
    document.documentElement.classList.add('js')

    const elements = document.querySelectorAll('.reveal:not(.visible)')

    if (prefersReducedMotion()) {
      elements.forEach((el) => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            // Small delay per element so a row of cards appears one after another
            setTimeout(() => entry.target.classList.add('visible'), i * 70)
            observer.unobserve(entry.target)
          })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname]) // <- re-run on every navigation

  return null
}
