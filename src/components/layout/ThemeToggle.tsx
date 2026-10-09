'use client'

import { useLayoutEffect } from 'react'
import { getInitialTheme, toggleTheme } from '@/lib/theme'
import { Icon } from '@/components/ui/Icon'

export function ThemeToggle() {
  // In development React re-mounts the page once and wipes the attribute the inline
  // script set on <html>. Put it back before the browser paints. (No-op in production.)
  useLayoutEffect(() => {
    const root = document.documentElement
    if (!root.hasAttribute('data-theme')) root.setAttribute('data-theme', getInitialTheme())
  }, [])

  return (
    <button type="button" className="icon-btn theme-toggle" aria-label="Toggle light / dark theme" onClick={toggleTheme}>
      {/* CSS shows only one of these, based on <html data-theme="..."> */}
      <Icon name="sun" className="icon-sun" />
      <Icon name="moon" className="icon-moon" />
    </button>
  )
}
