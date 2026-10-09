import { site } from '@/data/site'
import { Logo } from './Logo'

/** No 'use client' here: this is a Server Component. It only shows content, so it ships no JavaScript. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Logo label="Back to home" />
        <p className="footer-copy">
          &copy; {site.copyrightYear} {site.name}. All rights reserved.
        </p>
        <p className="footer-built mono">built with next.js · react · typescript</p>
      </div>
    </footer>
  )
}
