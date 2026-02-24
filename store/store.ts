import { createStore as createZustandStore } from 'zustand/vanilla'
import { type JSONContent } from '@tiptap/react'
import processContent from './pipelines'

export interface States {
  mode: 'cantonese' | 'mandarin' | 'subtitle'
  outputContent: JSONContent | undefined
}

export interface Actions {
  onRawContentUpdate: (content: JSONContent) => void
  updateMode: (mode: 'cantonese' | 'mandarin' | 'subtitle') => void
}

export type Store = States & Actions

const defaultState: States = {
  mode: 'cantonese',
  outputContent: undefined,
}

export const createStore = (initialStates: States = defaultState) => {
  return createZustandStore<Store>()((set, get) => ({
    ...initialStates,
    onRawContentUpdate: (content) => {
      set({ outputContent: processContent(content, get().mode) })
    },
    updateMode: (mode: 'cantonese' | 'mandarin' | 'subtitle') => {
      set({
        mode,
        outputContent: processContent(get().outputContent, mode),
      })
    },
  }))
}
