'use client'

/**
 * Contact form. There's no server here: on submit it opens the visitor's
 * email app with the message already written (a "mailto:" link).
 *
 * This is a "controlled form": each input's value lives in React state,
 * and onChange updates that state as the visitor types.
 *
 * Next step if you want real sending: a Server Action or a route handler
 * (src/app/api/...) that calls an email service such as Resend.
 */
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { site } from '@/data/site'
import { Icon } from '@/components/ui/Icon'

type Fields = { name: string; email: string; subject: string; message: string }
type FieldName = keyof Fields

const EMPTY: Fields = { name: '', email: '', subject: '', message: '' }

export function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY)
  const [invalid, setInvalid] = useState<FieldName[]>([])
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null)
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const trimmed = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    }

    const empty = (Object.keys(trimmed) as FieldName[]).filter((key) => !trimmed[key])
    if (empty.length) return fail(empty, 'Please fill in all fields.')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      return fail(['email'], 'Please enter a valid email address.')
    }

    setInvalid([])
    const body = `${trimmed.message}\n\n— ${trimmed.name}\n${trimmed.email}`
    window.location.assign(`mailto:${site.email}?subject=${encodeURIComponent(trimmed.subject)}&body=${encodeURIComponent(body)}`)
    setStatus({ text: 'Your email app should open with the message ready — just hit send.', isError: false })
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
      <button type="submit" className="btn btn-primary btn-block magnetic">
        Send message <Icon name="send" />
      </button>
      <p className="form-note">Opens your email app with the message ready to send.</p>
      <p className={`form-status ${status?.isError ? 'error' : ''}`} role="status" aria-live="polite">
        {status?.text}
      </p>
    </form>
  )
}
