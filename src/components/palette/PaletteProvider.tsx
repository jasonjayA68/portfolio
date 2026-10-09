'use client'

/**
 * Open / closed state for the command palette, shared through React Context.
 * The Search button in the nav calls open(); the palette itself reads isOpen.
 * Same pattern as AssistantProvider, just smaller.
 */
import { createContext, useContext, useState, type ReactNode } from 'react'

type PaletteContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const value = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((current) => !current),
  }

  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
}

export function usePalette() {
  const context = useContext(PaletteContext)
  if (!context) throw new Error('usePalette must be used inside <PaletteProvider>')
  return context
}
