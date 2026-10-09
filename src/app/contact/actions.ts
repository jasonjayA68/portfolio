'use server'

/**
 * SERVER ACTION: sends a contact-form message to your inbox.
 *
 * 'use server' at the top means every function in this file runs ONLY on the
 * server. The browser can call sendContactMessage() like a normal function,
 * but Next.js turns that call into a request to the server behind the scenes.
 * That's why the secret API key in process.env is safe here: it never reaches
 * the visitor's browser.
 *
 * Email delivery is done by Resend (resend.com). Setup is in the README.
 */
import { Resend } from 'resend'
import { site } from '@/data/site'

export type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
  website: string // hidden "honeypot" field: real people leave it empty, spam bots fill it in
}

export type ContactResult = { ok: true } | { ok: false; error: string }

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  // 1. Never trust data from the browser: check it again here, even though the form already did
  const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
  const name = clean(input?.name, LIMITS.name)
  const email = clean(input?.email, LIMITS.email)
  const subject = clean(input?.subject, LIMITS.subject).replace(/[\r\n]+/g, ' ')
  const message = clean(input?.message, LIMITS.message)

  if (!name || !email || !subject || !message) {
    return { ok: false, error: 'Please fill in all fields.' }
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  // 2. A bot filled in the hidden field: pretend it worked, but don't send anything
  if (typeof input?.website === 'string' && input.website.trim() !== '') {
    return { ok: true }
  }

  // 3. Secrets come from environment variables (.env.local on your PC, project settings on Vercel)
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('Contact form: RESEND_API_KEY is not set, so the message was not sent.')
    return { ok: false, error: 'The contact form is not set up yet.' }
  }

  // 4. Send it. replyTo means hitting "Reply" in Gmail answers the visitor directly.
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: 'Portfolio contact form <onboarding@resend.dev>',
    to: process.env.CONTACT_TO_EMAIL || site.email,
    replyTo: email,
    subject: `Portfolio: ${subject}`,
    text: [`From: ${name} <${email}>`, `Subject: ${subject}`, '', message].join('\n'),
  })

  if (error) {
    console.error('Contact form: Resend could not send the message.', error)
    return { ok: false, error: 'Your message could not be sent.' }
  }

  return { ok: true }
}
