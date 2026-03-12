import { type JSONContent } from '@tiptap/react'
import { mandarinLexiconPattern, cantoneseToMandarinMap } from '@/model/lexicon'

const processNode = (node: JSONContent): JSONContent | JSONContent[] => {
  if (node.type === 'text' && typeof node.text === 'string') {
    return replaceTextNode(node)
  }

  if (node.content && Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.flatMap((child) => processNode(child)),
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

  mandarinLexiconPattern.lastIndex = 0
  const match = mandarinLexiconPattern.exec(text)

  if (!match || match.index === undefined) {
    return [node]
  }

  const matchedWord = match[0]
  const startIndex = match.index
  const endIndex = startIndex + matchedWord.length

  const beforeText = text.slice(0, startIndex)
  const afterText = text.slice(endIndex)
  const replacement = cantoneseToMandarinMap.get(matchedWord)!

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

const mandarinPipeline = (content: JSONContent) => {
  const processedContent = {
    ...content,
    content: content.content?.flatMap((child) => processNode(child)),
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('Processed content in Mandarin mode:')
    console.log(processedContent)
  }
  return processedContent
}

export default mandarinPipeline
