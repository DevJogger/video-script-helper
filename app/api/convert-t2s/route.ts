import { NextRequest, NextResponse } from 'next/server'
import { OpenCC } from 'opencc'

let converter: OpenCC | null = null

function getConverter(): OpenCC {
  if (!converter) {
    converter = new OpenCC('t2s.json')
  }
  return converter
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: '無效的文本輸入' }, { status: 400 })
    }

    const opencc = getConverter()
    const converted = await opencc.convertPromise(text)

    return NextResponse.json({ result: converted })
  } catch (error) {
    console.error('轉換文本時出錯:', error)
    return NextResponse.json(
      { error: '轉換文本時出錯: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
