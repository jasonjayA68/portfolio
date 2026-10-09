'use client'

import { Icon } from '@/components/ui/Icon'
import { useAssistant } from './AssistantProvider'

/** The dashed "Quick question?" card on the Contact page. Opens the chat. */
export function AskAssistantCard() {
  const { open } = useAssistant()
  return (
    <button type="button" className="card ask-card" onClick={() => open()}>
      <Icon name="spark" />
      <span>
        <strong>Quick question?</strong> Ask the portfolio assistant — instant answers about my work, stack and
        availability.
      </span>
    </button>
  )
}
