import { createStore as createZustandStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

export interface States {
  pronunciationHints: Record<string, boolean>[]
  rubyAnnotation: boolean
}

export interface Actions {
  updatePronunciationHint: (hint: string) => void
  toggleRubyAnnotation: () => void
}

export type SettingsStore = States & Actions

const defaultState: States = {
  // TODO: hardcode for now, optimize later
  pronunciationHints: ['guang', 'guo', 'kuang', 'kuo', 'n'].map((hint) => ({ [hint]: false })),
  rubyAnnotation: false,
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
      }),
      {
        name: 'settings-storage',
      }
    )
  )
}

export const settingsStore = createSettingsStore()
