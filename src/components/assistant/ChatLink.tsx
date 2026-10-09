'use client'

/**
 * A link inside a chat answer. It navigates to another page of the site
 * and closes the chat, so the visitor actually sees that page (useful on phones,
 * where the chat covers the whole screen).
 */
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useAssistant } from './AssistantProvider'

export function ChatLink({ href, children }: { href: string; children: ReactNode }) {
  const { close } = useAssistant()
  return (
    <Link href={href} onClick={close}>
      {children}
    </Link>
  )
}
