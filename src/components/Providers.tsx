'use client'

/**
 * Every React Context provider in one place, so layout.tsx stays readable.
 * Anything inside <Providers> can call useAssistant() or usePalette().
 */
import type { ReactNode } from 'react'
import { AssistantProvider } from './assistant/AssistantProvider'
import { PaletteProvider } from './palette/PaletteProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AssistantProvider>
      <PaletteProvider>{children}</PaletteProvider>
    </AssistantProvider>
  )
}
