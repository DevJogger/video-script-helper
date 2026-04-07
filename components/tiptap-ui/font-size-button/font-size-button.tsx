"use client"

import { forwardRef, useCallback } from "react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Tiptap UI ---
import type { FontSizeAction, UseFontSizeConfig } from "@/components/tiptap-ui/font-size-button"
import { useFontSize } from "@/components/tiptap-ui/font-size-button"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

export interface FontSizeButtonProps
  extends Omit<ButtonProps, "type">, UseFontSizeConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
}

/**
 * Button component for changing font size in a Tiptap editor.
 *
 * For custom button implementations, use the `useFontSize` hook instead.
 */
export const FontSizeButton = forwardRef<HTMLButtonElement, FontSizeButtonProps>(
  (
    {
      editor: providedEditor,
      action,
      text,
      onChanged,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const {
      isVisible,
      handleFontSize,
      label,
      canChange,
      Icon,
    } = useFontSize({
      editor,
      action,
      onChanged,
    })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleFontSize()
      },
      [handleFontSize, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        disabled={!canChange}
        variant="ghost"
        data-disabled={!canChange}
        role="button"
        tabIndex={-1}
        aria-label={label}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

FontSizeButton.displayName = "FontSizeButton"
