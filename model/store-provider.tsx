'use client'
import { type ReactNode, createContext, useState, useContext } from 'react'
import { useStore as useZustandStore } from 'zustand'

import { type EditorStore, createEditorStore } from './editor-store'
import { type SettingsStore, createSettingsStore } from './settings-store'

export type EditorStoreApi = ReturnType<typeof createEditorStore>
export type SettingsStoreApi = ReturnType<typeof createSettingsStore>

export const EditorStoreContext = createContext<EditorStoreApi | undefined>(undefined)
export const SettingsStoreContext = createContext<SettingsStoreApi | undefined>(undefined)

export interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [settingsStore] = useState(() => createSettingsStore())
  const [editorStore] = useState(() => createEditorStore())
  return (
    <SettingsStoreContext.Provider value={settingsStore}>
      <EditorStoreContext.Provider value={editorStore}>{children}</EditorStoreContext.Provider>
    </SettingsStoreContext.Provider>
  )
}

export const useEditorStore = <T,>(selector: (store: EditorStore) => T): T => {
  const storeContext = useContext(EditorStoreContext)
  if (!storeContext) {
    throw new Error(`useEditorStore must be used within StoreProvider`)
  }

  return useZustandStore(storeContext, selector)
}

export const useSettingsStore = <T,>(selector: (store: SettingsStore) => T): T => {
  const storeContext = useContext(SettingsStoreContext)
  if (!storeContext) {
    throw new Error(`useSettingsStore must be used within StoreProvider`)
  }

  return useZustandStore(storeContext, selector)
}
