import { type JSONContent } from '@tiptap/react'
import { type States } from './store'

const cantonesePipeline = (content: JSONContent) => {
  console.log('Processing content in Cantonese mode...')
  console.log(content)
  return content
}

const mandarinPipeline = (content: JSONContent) => {
  console.log('Processing content in Mandarin mode...')
  console.log(content)
  return content
}

const subtitlePipeline = (content: JSONContent) => {
  console.log('Processing content in Subtitle mode...')
  console.log(content)
  return content
}

const processContent = (content: JSONContent | undefined, mode: States['mode']) => {
  if (!content) return undefined
  switch (mode) {
    case 'cantonese':
      return cantonesePipeline(content)
    case 'mandarin':
      return mandarinPipeline(content)
    case 'subtitle':
      return subtitlePipeline(content)
    default:
      return content
  }
}

export default processContent
