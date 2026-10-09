'use client'

/**
 * Shared state for the chat assistant, using React Context.
 *
 * Several unrelated components need to open the chat: the floating button,
 * the hero terminal, the contact page and the command palette. Instead of
 * passing props through every level, they all call:
 *
 *   const { open } = useAssistant()
 *   open('Are you available?')
 *
 * <AssistantProvider> wraps the whole app in src/app/layout.tsx.
 */
import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/lib/motion'
import { getAnswer, greeting, suggestions as suggestionSets } from './answers'

export type Message = {
  id: number
  from: 'user' | 'bot'
  content: ReactNode
}

type AssistantContextValue = {
  isOpen: boolean
  messages: Message[]
  isTyping: boolean
  suggestions: string[]
  open: (question?: string) => void
  close: () => void
  ask: (question: string) => void
}

const AssistantContext = createContext<AssistantContextValue | null>(null)

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // useRef holds values that should NOT re-render the UI when they change
  const nextId = useRef(0)
  const isBusy = useRef(false)
  const hasGreeted = useRef(false)

  function addMessage(from: Message['from'], content: ReactNode) {
    const message = { id: nextId.current++, from, content }
    setMessages((current) => [...current, message])
  }

  function ask(question: string) {
    const text = question.trim()
    if (!text || isBusy.current) return
    isBusy.current = true

    addMessage('user', text)
    setSuggestions([])
    setIsTyping(true)

    // A short pause so it feels like the assistant is "typing"
    const delay = prefersReducedMotion() ? 50 : 550 + Math.random() * 350
    setTimeout(() => {
      setIsTyping(false)
      addMessage('bot', getAnswer(text))
      setSuggestions(suggestionSets.after)
      isBusy.current = false
    }, delay)
  }

  function open(question?: string) {
    setIsOpen(true)
    if (!hasGreeted.current) {
      hasGreeted.current = true
      addMessage('bot', greeting)
      setSuggestions(suggestionSets.start)
    }
    if (question) ask(question)
  }

  function close() {
    setIsOpen(false)
  }

  const value = { isOpen, messages, isTyping, suggestions, open, close, ask }

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

/** Use this hook in any client component to talk to the assistant. */
export function useAssistant() {
  const context = useContext(AssistantContext)
  if (!context) throw new Error('useAssistant must be used inside <AssistantProvider>')
  return context
}
