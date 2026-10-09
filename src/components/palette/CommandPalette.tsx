'use client'

/**
 * Command palette — press Ctrl+K (or ⌘K on a Mac).
 *
 * The key Next.js idea here is `useRouter()`: router.push('/projects')
 * navigates in code, exactly like clicking a <Link href="/projects">.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { navLinks } from '@/data/navigation'
import { projects, projectFilters, displayDomain } from '@/data/projects'
import { site } from '@/data/site'
import { toggleTheme } from '@/lib/theme'
import { Icon, type IconName } from '@/components/ui/Icon'
import { useAssistant } from '@/components/assistant/AssistantProvider'
import { usePalette } from './PaletteProvider'

type Action = {
  group: string
  label: string
  icon: IconName
  hint?: string
  run: () => void
}

/**
 * The outer part is always mounted: it listens for Ctrl+K / ⌘K anywhere on the site.
 * The dialog only exists while open, so every time it opens it starts fresh
 * (empty search, first item highlighted) without any reset code.
 */
export function CommandPalette() {
  const { isOpen, toggle } = usePalette()

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    // The cleanup function removes the listener if this component ever unmounts
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  return isOpen ? <PaletteDialog /> : null
}

function PaletteDialog() {
  const router = useRouter()
  const assistant = useAssistant()
  const { close } = usePalette()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  /* ---------- 1. Every action the palette can run ---------- */
  const actions: Action[] = [
    { group: 'pages', label: 'Home', icon: 'arrow', hint: '/', run: () => router.push('/') },
    ...navLinks.map((link) => ({
      group: 'pages',
      label: link.label,
      icon: 'arrow' as const,
      hint: link.href,
      run: () => router.push(link.href),
    })),
    { group: 'pages', label: 'AI roadmap', icon: 'arrow', hint: '/skills#roadmap', run: () => router.push('/skills#roadmap') },

    { group: 'actions', label: 'Ask the assistant', icon: 'spark', run: () => assistant.open() },
    { group: 'actions', label: 'Toggle light / dark theme', icon: 'sun', run: toggleTheme },
    { group: 'actions', label: `Email ${site.firstName}`, icon: 'mail', hint: 'mail', run: () => window.location.assign(`mailto:${site.email}`) },
    { group: 'actions', label: 'Message on WhatsApp', icon: 'whatsapp', run: () => window.open(site.whatsappUrl, '_blank', 'noopener') },

    ...projectFilters
      .filter((filter) => filter.value !== 'all')
      .map((filter) => ({
        group: 'filter work',
        label: `Show ${filter.label} projects`,
        icon: 'search' as const,
        hint: `?filter=${filter.value}`,
        run: () => router.push(`/projects?filter=${filter.value}`),
      })),

    ...projects.map((project) => ({
      group: 'projects',
      label: project.title,
      icon: 'layers' as const,
      hint: displayDomain(project.url),
      run: () => router.push(`/projects/${project.slug}`),
    })),
  ]

  /* ---------- 2. Filter actions by what was typed ---------- */
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const results = actions.filter((action) => {
    const haystack = `${action.label} ${action.group} ${action.hint ?? ''}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  })
  if (query.trim()) {
    results.push({
      group: 'assistant',
      label: `Ask: “${query.trim()}”`,
      icon: 'spark',
      run: () => assistant.open(query.trim()),
    })
  }
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0))

  /* ---------- 3. Focus the search box on open; give focus back on close ---------- */
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    return () => previousFocus?.focus()
  }, [])

  // Keep the highlighted item scrolled into view
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [safeIndex])

  function run(index: number) {
    const action = results[index]
    if (!action) return
    close()
    action.run()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault()
      setActiveIndex((safeIndex + 1) % results.length)
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault()
      setActiveIndex((safeIndex - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      run(safeIndex)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      event.preventDefault() // keep focus inside the palette
    }
  }

  return (
    <div className="palette" role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="palette-backdrop" onClick={close} />
      <div className="palette-box hud">
        <div className="palette-search">
          <Icon name="search" />
          <label htmlFor="paletteInput" className="sr-only">
            Type a command or search
          </label>
          <input
            ref={inputRef}
            id="paletteInput"
            type="text"
            placeholder="Jump to a page, project or action…"
            autoComplete="off"
            role="combobox"
            aria-expanded="true"
            aria-controls="paletteList"
            aria-autocomplete="list"
            aria-activedescendant={results.length ? `pal-${safeIndex}` : undefined}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd>esc</kbd>
        </div>

        <ul className="palette-list" id="paletteList" role="listbox" ref={listRef}>
          {results.length === 0 && <li className="palette-empty">No matches.</li>}
          {results.map((action, index) => (
            // PaletteRow also prints the group heading before the first item of each group
            <PaletteRow
              key={`${action.group}-${action.label}`}
              action={action}
              index={index}
              showGroup={index === 0 || results[index - 1].group !== action.group}
              selected={index === safeIndex}
              onHover={() => setActiveIndex(index)}
              onClick={() => run(index)}
            />
          ))}
        </ul>

        <p className="palette-foot mono">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>type a question to ask the assistant</span>
        </p>
      </div>
    </div>
  )
}

type PaletteRowProps = {
  action: Action
  index: number
  showGroup: boolean
  selected: boolean
  onHover: () => void
  onClick: () => void
}

function PaletteRow({ action, index, showGroup, selected, onHover, onClick }: PaletteRowProps) {
  return (
    <>
      {showGroup && (
        <li className="palette-group" role="presentation">
          {action.group}
        </li>
      )}
      <li
        className="palette-item"
        role="option"
        id={`pal-${index}`}
        aria-selected={selected}
        onMouseMove={selected ? undefined : onHover}
        onClick={onClick}
      >
        <Icon name={action.icon} />
        <span>{action.label}</span>
        {action.hint && <small>{action.hint}</small>}
      </li>
    </>
  )
}
