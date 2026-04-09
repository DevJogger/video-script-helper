"use client"

import { useCallback, useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- UI Components ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FontSizeSelectProps {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Available font sizes to choose from
   */
  fontSizes?: number[]
  /**
   * Callback function called after a successful font size change.
   */
  onChanged?: () => void
}

const DEFAULT_FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72]

/**
 * Gets current font size from editor selection
 */
function getCurrentFontSize(editor: Editor | null): string {
  if (!editor) return ""
  
  const { fontSize } = editor.getAttributes("textStyle")
  
  // If no fontSize is set, return empty string to show placeholder
  if (!fontSize) return ""
  
  // Extract numeric value from fontSize string (e.g., "16px" -> "16")
  const match = fontSize.match(/^(\d+(?:\.\d+)?)/)
  return match ? Math.round(parseFloat(match[1])).toString() : ""
}

/**
 * Checks if font size can be changed in the current editor state
 */
function canChangeFontSize(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.can().setMark("textStyle")
}

/**
 * Select component for changing font size in a Tiptap editor.
 */
export const FontSizeSelect: React.FC<FontSizeSelectProps> = ({
  editor: providedEditor,
  fontSizes = DEFAULT_FONT_SIZES,
  onChanged,
}) => {
  const { editor } = useTiptapEditor(providedEditor)
  const [currentSize, setCurrentSize] = useState<string>("")

  // Update current size when editor selection changes
  useEffect(() => {
    if (!editor) return

    const updateSize = () => {
      setCurrentSize(getCurrentFontSize(editor))
    }

    // Initial update
    updateSize()

    // Listen to selection and transaction updates
    editor.on('selectionUpdate', updateSize)
    editor.on('update', updateSize)

    return () => {
      editor.off('selectionUpdate', updateSize)
      editor.off('update', updateSize)
    }
  }, [editor])

  const handleValueChange = useCallback(
    (value: string) => {
      if (!editor || !canChangeFontSize(editor)) return

      const success = editor.chain().focus().setFontSize(`${value}px`).run()
      if (success) {
        setCurrentSize(value)
        onChanged?.()
      }
    },
    [editor, onChanged]
  )

  const canChange = canChangeFontSize(editor)

  return (
    <Select
      value={currentSize}
      onValueChange={handleValueChange}
      disabled={!canChange}
    >
      <SelectTrigger className="w-16 h-8 text-xs">
        <SelectValue placeholder=" " />
      </SelectTrigger>
      <SelectContent>
        {fontSizes.map((size) => (
          <SelectItem key={size} value={String(size)} className="text-xs">
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

FontSizeSelect.displayName = "FontSizeSelect"
