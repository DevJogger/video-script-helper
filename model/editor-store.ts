import { createStore as createZustandStore } from 'zustand/vanilla'
import { type JSONContent } from '@tiptap/react'

export interface States {
  rawContent: JSONContent | undefined
  mode: 'cantonese' | 'mandarin' | 'subtitle'
}

export interface Actions {
  onRawContentUpdate: (content: JSONContent) => void
  updateMode: (mode: 'cantonese' | 'mandarin' | 'subtitle') => void
}

export type EditorStore = States & Actions

const defaultState: States = {
  rawContent: undefined,
  mode: 'cantonese',
}

export const createEditorStore = (initialStates: States = defaultState) => {
  return createZustandStore<EditorStore>()((set) => ({
    ...initialStates,
    onRawContentUpdate: (content) => {
      set({ rawContent: content })
    },
    updateMode: (mode: 'cantonese' | 'mandarin' | 'subtitle') => {
      set({ mode })
    },
  }))
}
