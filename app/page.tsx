'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Printer, Download } from 'lucide-react'
import RichTextEditor from '@/components/rich-text-editor'
import SettingsDrawer from '@/components/settings-drawer'
import { useEditorStore, useSettingsStore } from '@/model/store-provider'
import { type JSONContent } from '@tiptap/react'
import processContent from '@/model/pipelines'

export default function Home() {
  const mode = useEditorStore((state) => state.mode)
  const rawContent = useEditorStore((state) => state.rawContent)
  const { onRawContentUpdate, updateMode } = useEditorStore((state) => state)
  const { pronunciationHints } = useSettingsStore((state) => state)

  const [outputContent, setOutputContent] = useState<JSONContent | undefined>(undefined)

  useEffect(() => {
    setOutputContent(processContent(rawContent, mode, pronunciationHints))
  }, [rawContent, mode, pronunciationHints])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // TODO: download the output content as a UTF-16 LE encoded .txt file
    alert('下載功能正在開發中')
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
                <Button
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
                </Button>
              </div>
            </div>
            <div className='flex gap-2'>
              {mode === 'subtitle' ? (
                <Button variant='outline' size='icon' title='下載' onClick={handleDownload}>
                  <Download className='h-4 w-4' />
                </Button>
              ) : (
                <Button variant='outline' size='icon' onClick={handlePrint} title='打印'>
                  <Printer className='h-4 w-4' />
                </Button>
              )}
              <SettingsDrawer>
                <Button variant='outline' size='icon' title='設置'>
                  <Settings className='h-4 w-4' />
                </Button>
              </SettingsDrawer>
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
