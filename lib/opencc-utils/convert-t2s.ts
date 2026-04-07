import { type JSONContent } from '@tiptap/react'

/**
 * Extracts all text content from a TipTap JSON structure
 */
function extractTexts(content: JSONContent): string[] {
  const texts: string[] = []

  if (typeof content.text === 'string') {
    texts.push(content.text)
  }

  if (Array.isArray(content.content)) {
    for (const child of content.content) {
      texts.push(...extractTexts(child))
    }
  }

  return texts
}

/**
 * Replaces text content in a TipTap JSON structure with converted values
 */
function replaceTexts(
  content: JSONContent,
  textMap: Map<string, string>
): JSONContent {
  const newContent = { ...content }

  if (typeof newContent.text === 'string') {
    newContent.text = textMap.get(newContent.text) || newContent.text
  }

  if (Array.isArray(newContent.content)) {
    newContent.content = newContent.content.map((child) =>
      replaceTexts(child, textMap)
    )
  }

  return newContent
}

/**
 * Converts Traditional Chinese to Simplified Chinese using the API
 */
export async function convertT2S(text: string): Promise<string> {
  try {
    const response = await fetch('/api/convert-t2s', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Failed to convert text:', error)
    throw error
  }
}

/**
 * Converts a TipTap JSONContent from Traditional to Simplified Chinese
 * Optimized to make only one API request
 */
export async function convertJSONContentT2S(content: JSONContent): Promise<JSONContent> {
  // Extract all unique texts
  const texts = extractTexts(content)
  const uniqueTexts = [...new Set(texts)]

  if (uniqueTexts.length === 0) {
    return content
  }

  // Convert all texts in one API call
  const combinedText = uniqueTexts.join('\n')
  const convertedCombined = await convertT2S(combinedText)
  const convertedTexts = convertedCombined.split('\n')

  // Create a map of original -> converted
  const textMap = new Map<string, string>()
  uniqueTexts.forEach((original, index) => {
    textMap.set(original, convertedTexts[index] || original)
  })

  // Replace texts in the JSON structure
  return replaceTexts(content, textMap)
}

