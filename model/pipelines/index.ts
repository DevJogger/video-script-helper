import cantonesePipeline from './cantonese-pipeline'
import mandarinPipeline from './mandarin-pipeline'
import subtitlePipeline from './subtitle-pipeline'
import { type JSONContent } from '@tiptap/react'
import { type States as EditorStoreStates } from '@/model/editor-store'

const processContent = (
  content: JSONContent | undefined,
  mode: EditorStoreStates['mode'],
  pronunciationHints: Record<string, boolean>[]
) => {
  if (!content) return undefined
  switch (mode) {
    case 'cantonese':
      return cantonesePipeline(content, pronunciationHints)
    case 'mandarin':
      return mandarinPipeline(content)
    case 'subtitle':
      return subtitlePipeline(content)
    default:
      return content
  }
}

export default processContent
