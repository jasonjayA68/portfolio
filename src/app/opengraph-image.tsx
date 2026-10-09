/**
 * The preview image shown when a link to the site is shared on
 * Facebook, LinkedIn, WhatsApp, X, Slack, etc. (1200×630 PNG).
 *
 * The file name `opengraph-image.tsx` is a Next.js rule. Next.js draws this
 * JSX into a PNG once, at build time. Only a subset of CSS works here
 * (flexbox, colors, gradients, borders), and every <div> needs display: flex.
 */
import { ImageResponse } from 'next/og'
import { site } from '@/data/site'

export const alt = `${site.name} — ${site.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          color: '#e8eaf0',
          backgroundColor: '#05060a',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(34,211,238,0.35), transparent 45%), radial-gradient(circle at 10% 95%, rgba(167,139,250,0.3), transparent 45%)',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 18,
              fontSize: 34,
              color: '#fff',
              backgroundImage: 'linear-gradient(120deg, #22d3ee, #818cf8, #a78bfa)',
            }}
          >
            jj
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#9ba1b0' }}>{site.name}</div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            Crafting digital experiences that convert.
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#9ba1b0' }}>
            {site.role} · WordPress · Shopify · Laravel
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 28 }}>
          <div style={{ display: 'flex', color: '#22d3ee' }}>14 client sites · 5+ years</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 22px',
              borderRadius: 999,
              border: '2px solid rgba(255,255,255,0.16)',
              color: '#e8eaf0',
            }}
          >
            <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 999, backgroundColor: '#4ade80' }} />
            Available for freelance work
          </div>
        </div>
      </div>
    ),
    size,
  )
}
