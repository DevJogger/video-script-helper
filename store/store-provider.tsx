'use client'
import { type ReactNode, createContext, useState, useContext } from 'react'
import { useStore as useZustandStore } from 'zustand'

import { type Store, createStore } from './store'

export type StoreApi = ReturnType<typeof createStore>

export const StoreContext = createContext<StoreApi | undefined>(undefined)

export interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState(() => createStore())
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = <T,>(selector: (store: Store) => T): T => {
  const storeContext = useContext(StoreContext)
  if (!storeContext) {
    throw new Error(`useStore must be used within StoreProvider`)
  }

  return useZustandStore(storeContext, selector)
}
