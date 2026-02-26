import { type JSONContent } from '@tiptap/react'
import { type States } from './store'
import { mandarinRegex, mandarinToCantoneseMap } from './lexicon'

const processNode = (node: JSONContent): JSONContent | JSONContent[] => {
  if (node.type === 'text' && typeof node.text === 'string') {
    return replaceTextNode(node)
  }

  if (node.content && Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.flatMap(processNode),
    }
  }

  return node
}

const replaceTextNode = (node: JSONContent): JSONContent[] => {
  const text = node.text || ''
  const originalMarks = node.marks || []

  if (originalMarks.some((mark) => mark.type === 'underline')) {
    return [node]
  }

  mandarinRegex.lastIndex = 0
  const match = mandarinRegex.exec(text)

  if (!match || match.index === undefined) {
    return [node]
  }

  const matchedWord = match[0]
  const startIndex = match.index
  const endIndex = startIndex + matchedWord.length

  const beforeText = text.slice(0, startIndex)
  const afterText = text.slice(endIndex)
  const replacement = mandarinToCantoneseMap.get(matchedWord)!

  const result: JSONContent[] = []

  if (beforeText) {
    result.push({
      type: 'text',
      text: beforeText,
      marks: originalMarks,
    })
  }

  result.push({
    type: 'text',
    text: replacement,
    marks: [
      ...originalMarks,
      {
        type: 'textStyle',
        attrs: { color: '#ff0000' },
      },
    ],
  })

  if (afterText) {
    result.push(
      ...replaceTextNode({
        type: 'text',
        text: afterText,
        marks: originalMarks,
      })
    )
  }

  return result
}

const cantonesePipeline = (content: JSONContent) => {
  const processedContent = {
    ...content,
    content: content.content?.flatMap(processNode),
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('Original content in Cantonese mode:')
    console.log(content)
    console.log('Processed content in Cantonese mode:')
    console.log(processedContent)
  }
  return processedContent
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
