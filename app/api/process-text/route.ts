import { NextRequest, NextResponse } from 'next/server'

// Replace punctuation marks with spaces
function replacePunctuation(text: string): string {
  return text.replace(/[，。？！、；：（）《》【】｛｝]/g, ' ')
}

// Apply dictionary replacement
function applyDictionary(text: string, customDictionary?: Record<string, string>): string {
  let result = text
  for (const [key, value] of Object.entries(customDictionary || {})) {
    const regex = new RegExp(key, 'g')
    result = result.replace(regex, value)
  }

  return result
}

// Calculate text length (Chinese: 1, English: 0.5)
function getTextLength(text: string): number {
  let length = 0
  for (const char of text) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      // Chinese character
      length += 1
    } else if (/[a-zA-Z]/.test(char)) {
      // English character
      length += 0.5
    } else {
      // Other characters (numbers, symbols, etc.) count as 1
      length += 1
    }
  }
  return length
}

function normalizeEnglish(text: string): string {
  return text.replace(/([A-Za-z]+)/g, ' $1 ')
}

// Line breaking: ensure each line does not exceed 16 Chinese characters (English characters count as 0.5)
function breakLines(text: string, maxLength: number = 16): string {
  text = normalizeEnglish(text)

  const segmenter = new Intl.Segmenter('zh-Hant', { granularity: 'word' })

  const words = [...segmenter.segment(text)].map((s) => s.segment)

  console.log('Tokenized words:', words)

  const lines: string[] = []
  let currentLine = ''
  let currentLength = 0

  for (const word of words) {
    const wordLength = getTextLength(word)

    // If adding this word exceeds the limit
    if (currentLength + wordLength > maxLength && currentLine.length > 0) {
      lines.push(currentLine.trim())
      currentLine = word
      currentLength = wordLength
    } else {
      currentLine += word
      currentLength += wordLength
    }
  }

  // Add the last line
  if (currentLine.trim().length > 0) {
    lines.push(currentLine.trim())
  }

  return lines.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, customDictionary, maxLineLength = 16 } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: '無效的文本輸入' }, { status: 400 })
    }

    // Step 1: Replace punctuation
    let processed = replacePunctuation(text)

    // Step 2: Apply dictionary replacement
    processed = applyDictionary(processed, customDictionary)

    // Step 3: Line breaking
    processed = breakLines(processed, maxLineLength)

    return NextResponse.json({ result: processed })
  } catch (error) {
    console.error('處理文本時出錯:', error)
    return NextResponse.json({ error: '處理文本時出錯' }, { status: 500 })
  }
}
