'use client'

/**
 * The terminal box in the hero. It types out a short intro, then lets
 * visitors ask the assistant a question.
 *
 * The typing effect is just state: `progress` says which line we're on and how
 * many characters of it are visible. A timer bumps it forward; React redraws.
 */
import { useEffect, useState, type FormEvent } from 'react'
import { prefersReducedMotion } from '@/lib/motion'
import { Icon } from '@/components/ui/Icon'
import { useAssistant } from '@/components/assistant/AssistantProvider'

type Segment = { text: string; className?: string }
type Line = { segments: Segment[]; className?: string }

const LINES: Line[] = [
  { className: 't-cmd', segments: [{ text: '$', className: 't-prompt' }, { text: ' whoami' }] },
  { segments: [{ text: 'Full-stack web developer · 5+ years' }] },
  { segments: [{ text: 'stack', className: 't-key' }, { text: ' WordPress · Shopify · Laravel' }] },
  { segments: [{ text: 'ai', className: 't-key' }, { text: ' Claude Code · Cursor · Codex' }] },
  { segments: [{ text: 'shipped', className: 't-key' }, { text: ' 14 client sites · 4 agencies' }] },
  {
    segments: [
      { text: 'status', className: 't-key' },
      { text: ' ' },
      { text: 'available for freelance ✓', className: 't-ok' },
    ],
  },
]

const HINTS = [
  { label: 'Shopify work?', question: 'What Shopify work have you done?' },
  { label: 'Available?', question: 'Are you available?' },
  { label: 'Your process?', question: 'How do you work?' },
]

const lineLength = (line: Line) => line.segments.reduce((sum, s) => sum + s.text.length, 0)
const FINISHED = { line: LINES.length, chars: 0 }

export function HeroTerminal() {
  const { open } = useAssistant()
  const [question, setQuestion] = useState('')
  const [progress, setProgress] = useState({ line: 0, chars: 0 })

  // The typing "clock": every time progress changes, schedule the next step
  useEffect(() => {
    if (progress.line >= LINES.length) return // done

    let delay: number
    let next: typeof progress

    if (prefersReducedMotion()) {
      delay = 0
      next = FINISHED // skip the animation
    } else if (progress.chars < lineLength(LINES[progress.line])) {
      const isFirstKeystroke = progress.line === 0 && progress.chars === 0
      delay = isFirstKeystroke ? 500 : progress.line === 0 ? 70 : 16 // the command types slower
      next = { line: progress.line, chars: progress.chars + 1 }
    } else {
      delay = progress.line === 0 ? 380 : 160 // pause at the end of a line
      next = { line: progress.line + 1, chars: 0 }
    }

    const timer = setTimeout(() => setProgress(next), delay)
    return () => clearTimeout(timer)
  }, [progress])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    open(question.trim())
    setQuestion('')
  }

  const done = progress.line >= LINES.length

  return (
    <div className="terminal hud reveal" aria-label="Ask my portfolio assistant">
      <div className="terminal-bar">
        <span className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="terminal-title">jason@portfolio: ~</span>
        <span className="terminal-badge">assistant</span>
      </div>

      <div className="terminal-body">
        {LINES.map((line, i) => {
          if (i > progress.line) return null // not reached yet
          const visibleChars = i < progress.line ? Infinity : progress.chars
          const showCaret = i === progress.line || (done && i === LINES.length - 1)
          return (
            <p key={i} className={`t-line ${line.className ?? ''}`}>
              <TypedSegments segments={line.segments} visibleChars={visibleChars} />
              {showCaret && <span className="t-caret" aria-hidden="true" />}
            </p>
          )
        })}
      </div>

      <form className="terminal-ask" autoComplete="off" onSubmit={handleSubmit}>
        <label htmlFor="heroAskInput" className="sr-only">
          Ask about my work
        </label>
        <span className="t-prompt" aria-hidden="true">
          ›
        </span>
        <input
          id="heroAskInput"
          type="text"
          placeholder="Ask about my work…"
          maxLength={200}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button type="submit" className="terminal-send" aria-label="Ask">
          <Icon name="send" />
        </button>
      </form>

      <div className="terminal-hints">
        {HINTS.map((hint) => (
          <button key={hint.label} type="button" className="hint-chip" onClick={() => open(hint.question)}>
            {hint.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Prints the first `visibleChars` characters of a line, keeping each segment's color. */
function TypedSegments({ segments, visibleChars }: { segments: Segment[]; visibleChars: number }) {
  let remaining = visibleChars
  return segments.map((segment, i) => {
    const text = segment.text.slice(0, Math.max(remaining, 0))
    remaining -= segment.text.length
    if (!text) return null
    return (
      <span key={i} className={segment.className}>
        {text}
      </span>
    )
  })
}
