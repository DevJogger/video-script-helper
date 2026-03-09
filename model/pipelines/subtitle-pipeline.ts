import { type JSONContent } from '@tiptap/react'

const subtitlePipeline = (docNode: JSONContent) => {
  const processedContent = {
    ...docNode,
    content: docNode.content
      // remove all the empty paragraphs
      ?.filter(
        (paragraphNode) =>
          // remove the paragraphs that start with a hard break or don't have any content
          !!paragraphNode.content &&
          paragraphNode.content[0]?.type !== 'hardBreak' &&
          // keep only the paragraphs that don't have bold marks
          !paragraphNode.content[0]?.marks?.some((mark) => mark.type === 'bold')
      )
      // combine all the text nodes in a paragraph into one text node
      .map((paragraphNode) => {
        if (!!paragraphNode.content && paragraphNode.content.length > 1) {
          return {
            ...paragraphNode,
            content: [
              {
                type: 'text',
                text: paragraphNode.content.reduce((acc, curr) => {
                  if (curr.type === 'text' && typeof curr.text === 'string') {
                    return acc + curr.text
                  }
                  return acc
                }, ''),
              },
            ],
          }
        }
        return paragraphNode
      })
      // remove the paragraphs that don't contain any CJK characters
      .filter((paragraphNode) => {
        if (!paragraphNode.content || paragraphNode.content.length === 0) return false
        const textNode = paragraphNode.content[0]
        return (
          textNode.type === 'text' &&
          typeof textNode.text === 'string' &&
          /[\u4e00-\u9fff]/.test(textNode.text)
        )
      })
      // split the text by line breaks (，。) into an array of strings
      .reduce((acc: string[], curr) => {
        if (curr.content && curr.content.length > 0) {
          const textNode = curr.content[0]
          if (textNode.type === 'text' && typeof textNode.text === 'string') {
            acc.push(...textNode.text.split(/[，。]/))
          }
        }
        return acc
      }, [])
      // remove/replace certain punctuations, and trim the whitespace
      .map((line) =>
        line
          .replace(/[、＃#]/g, ' ')
          .replace(/《/g, '「')
          .replace(/》/g, '」')
          .trim()
      )
      // remove the empty strings
      .filter(Boolean)
      // convert the array of strings into an array of paragraph nodes
      .map((line) => ({
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: line,
          },
        ],
      })),
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Processed content in Subtitle mode:')
    console.log(processedContent)
  }
  return processedContent
}

export default subtitlePipeline
