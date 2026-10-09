'use client'

/**
 * Contact form. On submit it calls the Server Action in
 * src/app/contact/actions.ts, which emails the message to your inbox.
 *
 * This is a "controlled form": each input's value lives in React state,
 * and onChange updates that state as the visitor types.
 */
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { site } from '@/data/site'
import { Icon } from '@/components/ui/Icon'
import { sendContactMessage } from '@/app/contact/actions'

type Fields = { name: string; email: string; subject: string; message: string }
type FieldName = keyof Fields
type Status = { text: string; isError: boolean; showEmailFallback?: boolean }

const EMPTY: Fields = { name: '', email: '', subject: '', message: '' }

export function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY)
  const [honeypot, setHoneypot] = useState('')
  const [invalid, setInvalid] = useState<FieldName[]>([])
  const [status, setStatus] = useState<Status | null>(null)
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // One change handler for every field, using the input's `name` attribute
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function fail(fields: FieldName[], text: string) {
    setInvalid(fields)
    setStatus({ text, isError: true })
    formRef.current?.querySelector<HTMLElement>(`[name="${fields[0]}"]`)?.focus()
  }

  // `async` because we wait for the server to answer before showing the result
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (sending) return

    const trimmed = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    }

    // Quick checks in the browser so visitors get instant feedback.
    // The server checks again, because browser code can be bypassed.
    const empty = (Object.keys(trimmed) as FieldName[]).filter((key) => !trimmed[key])
    if (empty.length) return fail(empty, 'Please fill in all fields.')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      return fail(['email'], 'Please enter a valid email address.')
    }

    setInvalid([])
    setStatus(null)
    setSending(true)

    try {
      // This looks like a normal function call, but it runs on the server
      const result = await sendContactMessage({ ...trimmed, website: honeypot })

      if (result.ok) {
        setValues(EMPTY)
        setStatus({ text: `Thanks, ${trimmed.name}! Your message was sent. I'll reply to ${trimmed.email}.`, isError: false })
      } else {
        setStatus({ text: result.error, isError: true, showEmailFallback: true })
      }
    } catch {
      // Network down, server error, etc.
      setStatus({ text: 'Your message could not be sent.', isError: true, showEmailFallback: true })
    } finally {
      setSending(false)
    }
  }

  // Shared props for every input, so each field below stays short
  const fieldProps = (name: FieldName) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    required: true,
    'aria-invalid': invalid.includes(name) || undefined,
  })

  return (
    <form ref={formRef} className="card contact-form hud reveal" noValidate onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input type="text" placeholder="Your full name" autoComplete="name" {...fieldProps('name')} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="you@company.com" autoComplete="email" {...fieldProps('email')} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input type="text" placeholder="Project inquiry" {...fieldProps('subject')} />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea rows={6} placeholder="Tell me about your project…" {...fieldProps('message')} />
      </div>

      {/* Spam trap: hidden from people (and screen readers), but bots fill in every field */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block magnetic" disabled={sending}>
        {sending ? 'Sending…' : 'Send message'} <Icon name="send" />
      </button>
      <p className="form-note">Goes straight to my inbox.</p>
      <p className={`form-status ${status?.isError ? 'error' : ''}`} role="status" aria-live="polite">
        {status?.text}
        {status?.showEmailFallback && (
          <>
            {' '}
            Please email me directly at <a href={`mailto:${site.email}`}>{site.email}</a>.
          </>
        )}
      </p>
    </form>
  )
}
