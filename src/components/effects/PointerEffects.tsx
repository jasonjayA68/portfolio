'use client'

/**
 * Mouse effects for the whole site:
 *   - .card      -> a soft spotlight follows the cursor
 *   - .project   -> the card tilts in 3D
 *   - .magnetic  -> the button leans toward the cursor
 *
 * Instead of adding listeners to every card (cards come and go as you change
 * pages), ONE listener on the document checks what is under the cursor.
 * This is called "event delegation".
 *
 * The CSS does the drawing; this file only sets CSS variables like --mx and --rx.
 */
import { useEffect } from 'react'
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion'

export function PointerEffects() {
  useEffect(() => {
    if (!hasFinePointer()) return // touch screens: skip hover effects
    const allowMotion = !prefersReducedMotion()

    let tiltedCard: HTMLElement | null = null
    let magneticButton: HTMLElement | null = null

    function onPointerMove(event: PointerEvent) {
      const target = event.target as Element

      // 1. Spotlight
      const card = target.closest<HTMLElement>('.card')
      if (card) {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${event.clientX - r.left}px`)
        card.style.setProperty('--my', `${event.clientY - r.top}px`)
      }
      if (!allowMotion) return

      // 2. 3D tilt
      const project = target.closest<HTMLElement>('.project')
      if (tiltedCard && tiltedCard !== project) resetTilt(tiltedCard)
      if (project) {
        const r = project.getBoundingClientRect()
        const x = (event.clientX - r.left) / r.width - 0.5 // -0.5 … 0.5
        const y = (event.clientY - r.top) / r.height - 0.5
        project.classList.add('tilt-ready')
        project.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
        project.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
      }
      tiltedCard = project

      // 3. Magnetic buttons
      const button = target.closest<HTMLElement>('.magnetic')
      if (magneticButton && magneticButton !== button) magneticButton.style.transform = ''
      if (button) {
        const r = button.getBoundingClientRect()
        const x = event.clientX - (r.left + r.width / 2)
        const y = event.clientY - (r.top + r.height / 2)
        button.style.transform = `translate(${(x * 0.2).toFixed(1)}px, ${(y * 0.3).toFixed(1)}px)`
      }
      magneticButton = button
    }

    function resetTilt(el: HTMLElement) {
      el.style.removeProperty('--rx')
      el.style.removeProperty('--ry')
    }

    document.addEventListener('pointermove', onPointerMove)
    return () => document.removeEventListener('pointermove', onPointerMove)
  }, [])

  return null
}
