import { type JSONContent } from '@tiptap/react'

const mandarinPipeline = (content: JSONContent) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Original content in Mandarin mode:')
    console.log(content)
  }
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
