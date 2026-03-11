import rawCantoneseLexicon from '@/config/cantonese-lexicon.raw.json'
import rawMandarinLexicon from '@/config/mandarin-lexicon.raw.json'

interface RawLexiconEntry {
  mandarin?: unknown
  cantonese?: unknown
}

export interface LexiconEntry {
  mandarin: string
  cantonese: string
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

    result.push({
      mandarin: entry.mandarin,
      cantonese: entry.cantonese,
    })
  })

  return result
}

const cantoneseLexicon: LexiconEntry[] = compileLexicon(rawCantoneseLexicon as unknown[])
const mandarinLexicon: LexiconEntry[] = compileLexicon(rawMandarinLexicon as unknown[])

const mandarinToCantoneseMap = new Map<string, string>(
  cantoneseLexicon.map((item) => [item.mandarin, item.cantonese])
)

const cantoneseToMandarinMap = new Map<string, string>(
  mandarinLexicon.map((item) => [item.cantonese, item.mandarin])
)

// escape RegExp special characters in the words to be replaced
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const cantoneseLexiconPattern = new RegExp(
  cantoneseLexicon
    .map((item) => item.mandarin)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|'),
  'g'
)

const mandarinLexiconPattern = new RegExp(
  mandarinLexicon
    .map((item) => item.cantonese)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|'),
  'g'
)

export {
  cantoneseLexicon,
  mandarinToCantoneseMap,
  cantoneseLexiconPattern,
  mandarinLexicon,
  cantoneseToMandarinMap,
  mandarinLexiconPattern,
}
