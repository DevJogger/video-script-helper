import rawLexicon from '@/config/lexicon.raw.json'

interface RawLexiconEntry {
  mandarin?: unknown
  cantonese?: unknown
  reversible?: unknown
}

export interface LexiconEntry {
  mandarin: string
  cantonese: string
  reversible: boolean
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[Lexicon Error] ${message}`)
  }
}

const compileLexicon = (raw: unknown[]): LexiconEntry[] => {
  assert(Array.isArray(raw), 'Lexicon root must be an array')

  const seenMandarin = new Set<string>()
  const result: LexiconEntry[] = []

  raw.forEach((item, index) => {
    const entry = item as RawLexiconEntry

    assert(
      typeof entry.mandarin === 'string' && entry.mandarin.length > 0,
      `Entry #${index}: "mandarin" must be a non-empty string`
    )

    assert(
      typeof entry.cantonese === 'string' && entry.cantonese.length > 0,
      `Entry #${index}: "cantonese" must be a non-empty string`
    )

    if (seenMandarin.has(entry.mandarin)) {
      throw new Error(`[Lexicon Error] Duplicate mandarin entry: "${entry.mandarin}"`)
    }

    seenMandarin.add(entry.mandarin)

    const reversible = entry.reversible === undefined ? true : Boolean(entry.reversible)

    result.push({
      mandarin: entry.mandarin,
      cantonese: entry.cantonese,
      reversible,
    })
  })

  return result
}

const lexicon: LexiconEntry[] = compileLexicon(rawLexicon as unknown[])

const mandarinToCantoneseMap = new Map<string, string>(
  lexicon.map((item) => [item.mandarin, item.cantonese])
)

const mandarinWords = lexicon.map((item) => item.mandarin).sort((a, b) => b.length - a.length)

// escape RegExp special characters in the words to be replaced
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const mandarinRegex = new RegExp(mandarinWords.map(escapeRegExp).join('|'), 'g')

export { lexicon, mandarinToCantoneseMap, mandarinRegex }
