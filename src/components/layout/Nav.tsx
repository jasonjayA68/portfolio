'use client'

/**
 * Top navigation bar.
 *
 * It's a Client Component ('use client' above) because it needs:
 *   - usePathname() to highlight the page you're on
 *   - useState for the mobile menu and the "scrolled" background
 *   - click handlers for the Search button
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { navLinks } from '@/data/navigation'
import { Icon } from '@/components/ui/Icon'
import { usePalette } from '@/components/palette/PaletteProvider'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'

export function Nav() {
  const pathname = usePathname() // e.g. "/projects/curakidney"
  const palette = usePalette()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  // "/projects/curakidney" should still highlight "Work" (/projects)
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Darken the nav background once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on Escape or on a click outside the nav
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [menuOpen])

  const navClass = ['nav', scrolled && 'scrolled', menuOpen && 'menu-open'].filter(Boolean).join(' ')

  return (
    <header className={navClass} ref={navRef}>
      <div className="container nav-inner">
        <Logo />

        <nav aria-label="Primary">
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button type="button" className="kbd-btn" aria-label="Open command menu" aria-haspopup="dialog" onClick={palette.open}>
            <Icon name="search" />
            <span className="kbd-btn-label">Search</span>
            <ShortcutKey />
          </button>
          <ThemeToggle />
          <Link href="/contact" className="btn btn-primary btn-sm nav-cta">
            Hire me
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="navLinks"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

/**
 * "⌘K" on a Mac, "Ctrl K" everywhere else.
 * The server can't know the visitor's computer, so useSyncExternalStore takes two
 * answers: one for the server ("Ctrl K") and one read in the browser.
 */
const noSubscribe = () => () => {}
function ShortcutKey() {
  const label = useSyncExternalStore(
    noSubscribe, // the OS never changes, so there's nothing to subscribe to
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'), // browser
    () => 'Ctrl K', // server
  )
  return <kbd>{label}</kbd>
}
