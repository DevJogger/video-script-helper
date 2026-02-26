'use client'

import { useEditor, EditorContent, EditorContext, type Editor, JSONContent } from '@tiptap/react'
import { useEffect } from 'react'
import { StarterKit } from '@tiptap/starter-kit'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'

interface RichTextEditorProps {
  onUpdate?: (editor: Editor) => void
  content?: JSONContent
}
const RichTextEditor = ({ onUpdate, content }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Superscript, Subscript, TextStyle, Color],
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: 'focus:outline-none p-2 bg-stone-100 h-full',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor)
    },
  })

  useEffect(() => {
    if (!editor || !content) return
    editor.commands.setContent(content)
  }, [content, editor])

  return (
    <div className='focus-within:border-ring focus-within:ring-ring/50 no-scrollbar flex h-full w-full flex-1 flex-col overflow-auto rounded-lg font-mono focus-within:ring-2'>
      <EditorContext.Provider value={{ editor }}>
        <div className='sticky top-0 z-10 flex gap-1 border-b bg-stone-100 p-1'>
          <MarkButton editor={editor} type='bold' />
          <MarkButton editor={editor} type='italic' />
          <MarkButton editor={editor} type='strike' />
          <MarkButton editor={editor} type='underline' />
          <UndoRedoButton editor={editor} action='undo' />
          <UndoRedoButton editor={editor} action='redo' />
        </div>
        <EditorContent className='flex-1 overflow-auto' editor={editor} role='presentation' />
      </EditorContext.Provider>
    </div>
  )
}

export default RichTextEditor
