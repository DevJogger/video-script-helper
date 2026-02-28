'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Printer, Download } from 'lucide-react'
import RichTextEditor from '@/components/rich-text-editor'
import { useStore } from '@/model/store-provider'

export default function Home() {
  const { onRawContentUpdate, mode, updateMode, outputContent } = useStore((state) => state)

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className='container mx-auto flex h-svh flex-col p-4 lg:p-8 print:p-0 print:pt-8'>
      <h1 className='sr-only mb-8 text-center text-3xl font-bold'>視頻稿件處理工具</h1>
      <div className='grid flex-1 gap-6 lg:grid-cols-2'>
        {/* Left side: Input area */}
        <Card className='print:hidden'>
          <CardHeader className='flex h-9 items-center justify-between'>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col gap-4'>
            <RichTextEditor
              onUpdate={(editor) => {
                onRawContentUpdate(editor.getJSON())
              }}
            />
          </CardContent>
        </Card>

        {/* Right side: Output area */}
        <Card className='print:border-0 print:p-0 print:shadow-none'>
          <CardHeader className='flex h-9 items-center justify-between print:hidden'>
            <div className='flex items-center gap-4'>
              <CardTitle>Output</CardTitle>
              <div className='flex gap-2'>
                <Button
                  onClick={() => updateMode('cantonese')}
                  className='flex-1'
                  variant={mode === 'cantonese' ? 'default' : 'outline'}
                >
                  粵
                </Button>
                {/* <Button
                  onClick={() => updateMode('mandarin')}
                  className='flex-1'
                  variant={mode === 'mandarin' ? 'default' : 'outline'}
                >
                  國
                </Button>
                <Button
                  onClick={() => updateMode('subtitle')}
                  className='flex-1'
                  variant={mode === 'subtitle' ? 'default' : 'outline'}
                >
                  字幕
                </Button> */}
              </div>
            </div>
            <div className='flex gap-2'>
              {/* <Button
                variant='outline'
                size='icon'
                // onClick={handleCopy}
                title='複製'
                disabled
              >
                <Copy className='h-4 w-4' />
              </Button> */}
              <Button variant='outline' size='icon' onClick={handlePrint} title='打印'>
                <Printer className='h-4 w-4' />
              </Button>
              {/* <Button
                variant='outline'
                size='icon'
                // onClick={handleDownload}
                title='下載'
                disabled
              >
                <Download className='h-4 w-4' />
              </Button> */}
            </div>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col gap-4'>
            <RichTextEditor content={outputContent} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
