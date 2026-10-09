'use client'

/**
 * The animated "neural network" behind the hero.
 *   - dots drift around and link up when they're close
 *   - the cursor pushes dots away and draws lines to nearby ones
 *   - clicking sends out a ring-shaped pulse
 *
 * React only renders the <canvas> element. All the drawing happens in
 * useEffect with the plain Canvas 2D API, the same code as the original site.
 * The cleanup function at the end stops the animation and removes every listener.
 */
import { useEffect, useRef } from 'react'
import { hasFinePointer, prefersReducedMotion } from '@/lib/motion'

type Dot = { x: number; y: number; vx: number; vy: number; bx: number; by: number; r: number }
type Pulse = { x: number; y: number; r: number }
type RGB = [number, number, number]

const LINK = 130 // max distance between two linked dots
const REACH = 170 // how far the cursor's influence reaches

export function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const hero = canvas?.parentElement
    if (!canvas || !ctx || !hero) return

    const reduceMotion = prefersReducedMotion()
    const root = document.documentElement
    const pointer = { x: 0, y: 0, active: false }
    const pulses: Pulse[] = []
    let width = 0
    let height = 0
    let dots: Dot[] = []
    let running = false
    let inView = true
    let colorA: RGB = [34, 211, 238]
    let colorB: RGB = [167, 139, 250]
    let light = false

    /* ----- colors follow the CSS theme variables ----- */
    const toRgb = (hex: string): RGB => {
      let h = hex.trim().replace('#', '')
      if (h.length === 3) h = h.split('').map((c) => c + c).join('')
      const n = parseInt(h, 16)
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    }
    const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`
    const readColors = () => {
      const styles = getComputedStyle(root)
      colorA = toRgb(styles.getPropertyValue('--accent') || '#22d3ee')
      colorB = toRgb(styles.getPropertyValue('--accent-2') || '#a78bfa')
      light = root.getAttribute('data-theme') === 'light'
    }

    /* ----- size the canvas and scatter the dots ----- */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = hero.offsetWidth
      height = hero.offsetHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(28, Math.min(110, Math.round((width * height) / 12500)))
      dots = Array.from({ length: count }, () => {
        const vx = (Math.random() - 0.5) * 0.36
        const vy = (Math.random() - 0.5) * 0.36
        return { x: Math.random() * width, y: Math.random() * height, vx, vy, bx: vx, by: vy, r: Math.random() * 1.4 + 0.7 }
      })
    }

    /* ----- draw one frame ----- */
    const frame = () => {
      ctx.clearRect(0, 0, width, height)
      const strength = light ? 0.55 : 1

      // move dots
      for (const d of dots) {
        if (pointer.active) {
          const dx = d.x - pointer.x
          const dy = d.y - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < REACH * 0.6 && dist > 0.1) {
            const force = (1 - dist / (REACH * 0.6)) * 0.9
            d.vx += (dx / dist) * force * 0.08
            d.vy += (dy / dist) * force * 0.08
          }
        }
        for (const p of pulses) {
          const dx = d.x - p.x
          const dy = d.y - p.y
          const dist = Math.hypot(dx, dy)
          if (Math.abs(dist - p.r) < 18 && dist > 0.1) {
            d.vx += (dx / dist) * 0.5
            d.vy += (dy / dist) * 0.5
          }
        }
        // ease back toward the normal drift speed
        d.vx = d.vx * 0.96 + d.bx * 0.04
        d.vy = d.vy * 0.96 + d.by * 0.04
        d.x += d.vx
        d.y += d.vy
        // bounce off the edges
        if (d.x < 0) { d.x = 0; d.vx = Math.abs(d.vx); d.bx = Math.abs(d.bx) }
        if (d.x > width) { d.x = width; d.vx = -Math.abs(d.vx); d.bx = -Math.abs(d.bx) }
        if (d.y < 0) { d.y = 0; d.vy = Math.abs(d.vy); d.by = Math.abs(d.by) }
        if (d.y > height) { d.y = height; d.vy = -Math.abs(d.vy); d.by = -Math.abs(d.by) }
      }

      // lines between nearby dots
      ctx.lineWidth = 1
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < LINK * LINK) {
            ctx.strokeStyle = rgba(colorA, (1 - Math.sqrt(distSq) / LINK) * 0.22 * strength)
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }

      // lines to the cursor + a soft glow
      if (pointer.active) {
        for (const d of dots) {
          const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y)
          if (dist < REACH) {
            ctx.strokeStyle = rgba(colorB, (1 - dist / REACH) * 0.55 * strength)
            ctx.beginPath()
            ctx.moveTo(d.x, d.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 90)
        glow.addColorStop(0, rgba(colorB, 0.16 * strength))
        glow.addColorStop(1, rgba(colorB, 0))
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, 90, 0, Math.PI * 2)
        ctx.fill()
      }

      // the dots themselves
      ctx.fillStyle = rgba(colorA, 0.75 * strength)
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // click pulses grow and fade
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.r += 6
        const life = 1 - p.r / 320
        if (life <= 0) {
          pulses.splice(i, 1)
          continue
        }
        ctx.strokeStyle = rgba(colorA, life * 0.6 * strength)
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.lineWidth = 1
      }

      if (running) requestAnimationFrame(frame)
    }

    /* ----- only animate while visible, to save battery ----- */
    const start = () => {
      if (running || reduceMotion || !inView || document.hidden) return
      running = true
      requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
    }

    readColors()
    resize()
    if (reduceMotion) frame()
    else start()

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        if (reduceMotion) frame()
      }, 150)
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onPointerMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as Element).closest('a, button, input, form, .terminal')) return
      const r = hero.getBoundingClientRect()
      pulses.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 })
    }

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    viewObserver.observe(hero)

    // Re-read the colors when the theme changes
    const themeObserver = new MutationObserver(() => {
      readColors()
      if (reduceMotion) frame()
    })
    themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] })

    if (hasFinePointer() && !reduceMotion) {
      hero.addEventListener('pointermove', onPointerMove)
      hero.addEventListener('pointerleave', onPointerLeave)
    }
    if (!reduceMotion) hero.addEventListener('pointerdown', onPointerDown)

    // Cleanup: runs when you leave the home page
    return () => {
      stop()
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      viewObserver.disconnect()
      themeObserver.disconnect()
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      hero.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  return <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
}
