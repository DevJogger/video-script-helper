import { type JSONContent } from '@tiptap/react'
import { pinyin, addTraditionalDict } from 'pinyin-pro'
import TraditionalDict from '@pinyin-pro/data/traditional'
import { mandarinRegex, mandarinToCantoneseMap } from '@/model/lexicon'

addTraditionalDict(TraditionalDict)

const processNode = (
  node: JSONContent,
  type: 'replace' | 'hint',
  pronunciationHints: Record<string, boolean>[]
): JSONContent | JSONContent[] => {
  if (node.type === 'text' && typeof node.text === 'string') {
    return type === 'replace' ? replaceTextNode(node) : hintPronunciation(node, pronunciationHints)
  }

  if (node.content && Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.flatMap((child) => processNode(child, type, pronunciationHints)),
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

const hintPronunciation = (
  node: JSONContent,
  pronunciationHints: Record<string, boolean>[]
): JSONContent[] => {
  if (!pronunciationHints.some((item) => Object.values(item)[0])) {
    return [node]
  }

  const text = node.text || ''
  const originalMarks = node.marks || []

  const pinyinRegex = new RegExp(
    `^(${pronunciationHints
      .filter((item) => Object.values(item)[0])
      .map((hint) => Object.keys(hint)[0])
      .join('|')})`,
    'g'
  )

  const character = pinyin(text, { toneType: 'none', type: 'array', traditional: true })
    .map((str, index) => ({
      original: text[index],
      match: str.length > 1 && pinyinRegex.exec(str),
      index,
    }))
    .find((item) => !!item.match)

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
          color: '#fff000',
        },
      },
      {
        type: 'bold',
      },
    ],
  })

  if (afterText) {
    result.push(
      ...hintPronunciation(
        {
          type: 'text',
          text: afterText,
          marks: originalMarks,
        },
        pronunciationHints
      )
    )
  }

  return result
}

const cantonesePipeline = (content: JSONContent, pronunciationHints: Record<string, boolean>[]) => {
  const replacedContent = {
    ...content,
    content: content.content?.flatMap((child) => processNode(child, 'replace', pronunciationHints)),
  }
  const processedContent = {
    ...replacedContent,
    content: replacedContent.content?.flatMap((child) =>
      processNode(child, 'hint', pronunciationHints)
    ),
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('Original content in Cantonese mode:')
    console.log(content)
    console.log('Processed content in Cantonese mode:')
    console.log(processedContent)
  }
  return processedContent
}

export default cantonesePipeline
