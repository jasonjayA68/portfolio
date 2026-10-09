'use client'

/**
 * The floating "Ask the assistant" button and the chat window.
 * All the data comes from useAssistant(); this file only draws it.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { site } from '@/data/site'
import { Icon } from '@/components/ui/Icon'
import { useAssistant } from './AssistantProvider'

export function ChatPanel() {
  const { isOpen, messages, isTyping, suggestions, open, close, ask } = useAssistant()
  const [input, setInput] = useState('')

  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)

  // Focus the text box when the panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // Keep the newest message in view
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, isTyping])

  function handleClose() {
    close()
    launcherRef.current?.focus()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault() // stop the browser from reloading the page
    ask(input)
    setInput('')
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="chat-launcher"
        aria-expanded={isOpen}
        aria-controls="chatPanel"
        onClick={() => open()}
      >
        <span className="chat-launcher-icon">
          <Icon name="spark" />
        </span>
        <span className="chat-launcher-label">Ask the assistant</span>
        <span className="status-dot" aria-hidden="true" />
      </button>

      <section
        className="chat-panel"
        id="chatPanel"
        role="dialog"
        aria-labelledby="chatTitle"
        hidden={!isOpen}
        onKeyDown={(event) => event.key === 'Escape' && handleClose()}
      >
        <header className="chat-head">
          <span className="logo-mark" aria-hidden="true">
            jj
          </span>
          <div className="chat-head-text">
            <h2 id="chatTitle">Portfolio assistant</h2>
            <p className="mono">
              <span className="status-dot" /> scripted · answers from this site
            </p>
          </div>
          <button type="button" className="icon-btn" aria-label="Close assistant" onClick={handleClose}>
            <Icon name="close" />
          </button>
        </header>

        <div className="chat-log" ref={logRef} role="log" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`msg msg-${message.from}`}>
              {/* A user message is plain text; a bot message is JSX from answers.tsx */}
              {typeof message.content === 'string' ? <p>{message.content}</p> : message.content}
            </div>
          ))}
          {isTyping && (
            <div className="msg msg-bot msg-typing" aria-label="Assistant is typing">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="chat-suggestions">
            {suggestions.map((text) => (
              <button key={text} type="button" className="hint-chip" onClick={() => ask(text)}>
                {text}
              </button>
            ))}
          </div>
        )}

        <form className="chat-form" autoComplete="off" onSubmit={handleSubmit}>
          <label htmlFor="chatInput" className="sr-only">
            Your question
          </label>
          <input
            ref={inputRef}
            id="chatInput"
            type="text"
            placeholder="Ask about projects, stack, rates…"
            maxLength={200}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" className="chat-send" aria-label="Send">
            <Icon name="send" />
          </button>
        </form>

        <div className="chat-actions">
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" /> WhatsApp
          </a>
          <a href={`mailto:${site.email}`}>
            <Icon name="mail" /> Email
          </a>
        </div>
      </section>
    </>
  )
}
