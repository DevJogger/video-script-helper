"use client"

import { useCallback, useMemo } from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { FontSizeIncreaseIcon } from "@/components/tiptap-icons/font-size-increase-icon"
import { FontSizeDecreaseIcon } from "@/components/tiptap-icons/font-size-decrease-icon"

export type FontSizeAction = "increase" | "decrease"

const FONT_SIZE_STEP = 2

/**
 * Configuration for the font size functionality
 */
export interface UseFontSizeConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The action to perform (increase or decrease)
   */
  action: FontSizeAction
  /**
   * Callback function called after a successful font size change.
   */
  onChanged?: () => void
}

export const fontSizeIcons = {
  increase: FontSizeIncreaseIcon,
  decrease: FontSizeDecreaseIcon,
}

/**
 * Gets current font size from editor selection
 */
function getCurrentFontSize(editor: Editor | null): number | null {
  if (!editor) return null
  
  const { fontSize } = editor.getAttributes("textStyle")
  if (!fontSize) return null
  
  const match = fontSize.match(/^(\d+(?:\.\d+)?)/)
  return match ? parseFloat(match[1]) : null
}

/**
 * Checks if font size can be changed in the current editor state
 */
export function canChangeFontSize(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.can().setMark("textStyle")
}

/**
 * Changes font size in the editor
 */
export function changeFontSize(
  editor: Editor | null,
  action: FontSizeAction
): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canChangeFontSize(editor)) return false

  const currentSize = getCurrentFontSize(editor) || 16
  const newSize = action === "increase" 
    ? currentSize + FONT_SIZE_STEP 
    : Math.max(8, currentSize - FONT_SIZE_STEP)

  return editor.chain().focus().setFontSize(`${newSize}px`).run()
}

/**
 * Gets the formatted action name
 */
export function getFormattedActionName(action: FontSizeAction): string {
  return action === "increase" ? "Increase font size" : "Decrease font size"
}

/**
 * Custom hook that provides font size functionality for Tiptap editor
 */
export function useFontSize(config: UseFontSizeConfig) {
  const {
    editor: providedEditor,
    action,
    onChanged,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const canChange = canChangeFontSize(editor)

  const handleFontSize = useCallback(() => {
    if (!editor) return false

    const success = changeFontSize(editor, action)
    if (success) {
      onChanged?.()
    }
    return success
  }, [editor, action, onChanged])

  const label = useMemo(() => getFormattedActionName(action), [action])
  const Icon = useMemo(() => fontSizeIcons[action], [action])

  return {
    isVisible: true,
    handleFontSize,
    canChange,
    label,
    Icon,
  }
}
