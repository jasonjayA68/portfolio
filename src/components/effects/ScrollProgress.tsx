'use client'

/**
 * The thin gradient bar at the very top that fills as you scroll,
 * plus the glowing line on the Experience timeline.
 */
import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let queued = false

    function update() {
      queued = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      barRef.current?.style.setProperty('--progress', progress.toFixed(4))

      // Only the Experience page has a timeline. Next.js keeps recently visited pages in the
      // DOM but hidden, so pick the one that is actually on screen (offsetParent is null when hidden).
      const timeline = Array.from(document.querySelectorAll<HTMLElement>('.timeline')).find(
        (el) => el.offsetParent !== null,
      )
      if (timeline) {
        const r = timeline.getBoundingClientRect()
        const fill = Math.min(Math.max((window.innerHeight * 0.65 - r.top) / r.height, 0), 1)
        timeline.style.setProperty('--timeline', fill.toFixed(3))
      }
    }

    // requestAnimationFrame = update at most once per screen refresh, however fast the scroll events come
    function onScroll() {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />
}
