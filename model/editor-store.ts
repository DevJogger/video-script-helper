import { createStore as createZustandStore } from 'zustand/vanilla'
import { type JSONContent } from '@tiptap/react'
import processContent from './pipelines'

export interface States {
  rawContent: JSONContent | undefined
  mode: 'cantonese' | 'mandarin' | 'subtitle'
  // outputContent: JSONContent | undefined
}

export interface Actions {
  onRawContentUpdate: (content: JSONContent) => void
  updateMode: (mode: 'cantonese' | 'mandarin' | 'subtitle') => void
}

export type EditorStore = States & Actions

const defaultState: States = {
  rawContent: undefined,
  mode: 'cantonese',
  // outputContent: undefined,
}

export const createEditorStore = (initialStates: States = defaultState) => {
  return createZustandStore<EditorStore>()((set, get) => ({
    ...initialStates,
    onRawContentUpdate: (content) => {
      set({
        rawContent: content,
        // outputContent: processContent(content, get().mode)
      })
    },
    updateMode: (mode: 'cantonese' | 'mandarin' | 'subtitle') => {
      set({
        mode,
        // outputContent: processContent(get().rawContent, mode),
      })
    },
  }))
}
