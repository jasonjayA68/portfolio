'use client'

/**
 * Text that "decodes" from random symbols into the real words
 * the first time it scrolls fully into view. Used in the section labels.
 */
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

const GLYPHS = '!<>-_/[]{}=+*^?#01'
const FRAMES = 20

export function DecodeText({ text }: { text: string }) {
  // The server renders the real text; the scramble only happens in the browser
  const [shown, setShown] = useState(text)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let frame = 0
    let rafId = 0

    function tick() {
      frame++
      const solved = Math.floor((frame / FRAMES) * text.length) // letters already decoded
      const scrambled = text
        .split('')
        .map((char, i) => (char === ' ' || i < solved ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('')
      setShown(frame < FRAMES ? scrambled : text)
      if (frame < FRAMES) rafId = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          tick()
        }
      },
      { threshold: 1 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
      setShown(text)
    }
  }, [text])

  return <span ref={ref}>{shown}</span>
}
