import { createStore as createZustandStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

export interface States {
  pronunciationHints: Record<string, boolean>[]
  rubyAnnotation: boolean
  subtitleBreakPosition: number
}

export interface Actions {
  updatePronunciationHint: (hint: string) => void
  toggleRubyAnnotation: () => void
  setSubtitleBreakPosition: (position: number) => void
}

export type SettingsStore = States & Actions

const defaultState: States = {
  // TODO: hardcode for now, optimize later
  pronunciationHints: ['guang', 'guo', 'kuang', 'kuo', 'nü'].map((hint) => ({ [hint]: false })),
  rubyAnnotation: false,
  subtitleBreakPosition: 16,
}

export const createSettingsStore = (initialStates: States = defaultState) => {
  return createZustandStore<SettingsStore>()(
    persist(
      (set) => ({
        ...initialStates,
        updatePronunciationHint: (hint: string) => {
          set((state) => ({
            pronunciationHints: state.pronunciationHints.map((item) =>
              item[hint] !== undefined ? { [hint]: !item[hint] } : item
            ),
          }))
        },
        toggleRubyAnnotation: () => set((state) => ({ rubyAnnotation: !state.rubyAnnotation })),
        setSubtitleBreakPosition: (position: number) => set({ subtitleBreakPosition: position }),
      }),
      {
        name: 'settings-storage',
      }
    )
  )
}

export const settingsStore = createSettingsStore()
