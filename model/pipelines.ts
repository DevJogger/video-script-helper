import { type JSONContent } from '@tiptap/react'
import { pinyin, addTraditionalDict } from 'pinyin-pro'
import TraditionalDict from '@pinyin-pro/data/traditional'
import { type States } from './store'
import { mandarinRegex, mandarinToCantoneseMap } from './lexicon'

addTraditionalDict(TraditionalDict)

const processNode = (node: JSONContent, type: 'replace' | 'hint'): JSONContent | JSONContent[] => {
  if (node.type === 'text' && typeof node.text === 'string') {
    return type === 'replace' ? replaceTextNode(node) : hintPronunciation(node)
  }

  if (node.content && Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.flatMap((child) => processNode(child, type)),
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

const hintPronunciation = (node: JSONContent): JSONContent[] => {
  const text = node.text || ''
  const originalMarks = node.marks || []

  // If the text is English alphabet, skip pronunciation hinting
  if (text && /[a-zA-Z]/.test(text)) {
    return [node]
  }

  // TODO: hardcode for now, optimize later
  const pinyinRegex = /^(guang|guo|kuang|n)/g

  // pinyinRegex.lastIndex = 0
  const character = pinyin(text, { toneType: 'none', type: 'array', traditional: true })
    .map((str, index) => ({ original: text[index], match: pinyinRegex.exec(str), index }))
    .find((item) => item.match !== null)

  if (!character) {
    return [node]
  }

  const matchedCharacter = character.original
  const startIndex = character.index
  const endIndex = startIndex + 1

  const beforeText = text.slice(0, startIndex)
  const afterText = text.slice(endIndex)

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
    text: matchedCharacter,
    marks: [
      ...originalMarks,
      {
        type: 'highlight',
        attrs: {
          color: '#fff59d',
        },
      },
    ],
  })

  if (afterText) {
    result.push(
      ...hintPronunciation({
        type: 'text',
        text: afterText,
        marks: originalMarks,
      })
    )
  }

  return result
}

const cantonesePipeline = (content: JSONContent) => {
  const replacedContent = {
    ...content,
    content: content.content?.flatMap((child) => processNode(child, 'replace')),
  }
  const processedContent = {
    ...replacedContent,
    content: replacedContent.content?.flatMap((child) => processNode(child, 'hint')),
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
