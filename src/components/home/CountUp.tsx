'use client'

/** A number that counts up from 0 when it scrolls into view: <CountUp to={14} /> */
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

export function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(to) // the server renders the final number
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let rafId = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3)))) // "ease-out" curve
          if (t < 1) rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [to, duration])

  return <span ref={ref}>{value}</span>
}
