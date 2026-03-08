import { type JSONContent } from '@tiptap/react'

const mandarinPipeline = (content: JSONContent) => {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '(功能開發中)',
          },
        ],
      },
    ],
  }
}

export default mandarinPipeline
