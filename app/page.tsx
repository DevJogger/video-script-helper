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
import { addRubyAnnotations } from '@/lib/ruby-annotation'

export default function Home() {
  const mode = useEditorStore((state) => state.mode)
  const rawContent = useEditorStore((state) => state.rawContent)
  const { onRawContentUpdate, updateMode } = useEditorStore((state) => state)
  const { pronunciationHints, rubyAnnotation } = useSettingsStore((state) => state)

  const [outputContent, setOutputContent] = useState<JSONContent | undefined>(undefined)
  const [downloadContent, setDownloadContent] = useState<string>('')
  const [rawPrintContent, setRawPrintContent] = useState<string>('')
  const [printContent, setPrintContent] = useState<string>('')

  useEffect(() => {
    setOutputContent(processContent(rawContent, mode, pronunciationHints))
  }, [rawContent, mode, pronunciationHints])

  useEffect(() => {
    const htmlWithPreservedEmptyLines = rawPrintContent.replace(/<p><\/p>/g, '<p><br></p>')
    setPrintContent(
      rubyAnnotation && mode === 'mandarin' ? addRubyAnnotations(htmlWithPreservedEmptyLines) : htmlWithPreservedEmptyLines
    )
  }, [rubyAnnotation, rawPrintContent, mode])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    const content = downloadContent.replace(/\n/g, '\r\n')
    const byteArray = [255, 254]
    for (let i = 0; i < content.length; ++i) {
      const charCode = content.charCodeAt(i)
      byteArray.push(charCode & 0xff)
      byteArray.push((charCode & 0xff00) >>> 8)
    }
    const blob = new Blob([new Uint8Array(byteArray)], { type: 'text/plain; charset=UTF-16LE;' })
    const consideredRawTitle =
      rawContent?.content?.[0]?.content?.reduce((acc, cur) => {
        if (cur.type === 'text' && typeof cur.text === 'string') {
          return acc + cur.text
        }
        return acc
      }, '') || ''
    const filename =
      (/(TEXT|TXT)/i.test(consideredRawTitle) &&
        consideredRawTitle.replace(/ (TEXT|TXT).*/gi, '')) ||
      'subtitle.txt'
    if ('showSaveFilePicker' in window) {
      try {
        const fileHandle = await (
          window as Window &
            typeof globalThis & {
              showSaveFilePicker: (options?: object) => Promise<FileSystemFileHandle>
            }
        ).showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'Text file', accept: { 'text/plain': ['.txt'] } }],
        })
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
      } catch (err) {
        if ((err as DOMException).name !== 'AbortError') throw err
        // user cancelled — do nothing
      }
    } else {
      // Fallback for Firefox / unsupported browsers
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    }
  }

  return (
    <>
      <main className='container mx-auto flex h-svh flex-col p-4 lg:p-8 print:hidden'>
        <h1 className='sr-only mb-8 text-center text-3xl font-bold'>視頻稿件處理工具</h1>
        <div className='grid flex-1 gap-6 lg:grid-cols-2'>
          {/* Left side: Input area */}
          <Card>
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
          <Card>
            <CardHeader className='flex h-9 items-center justify-between'>
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
              <RichTextEditor
                content={outputContent}
                onUpdate={(editor) => {
                  setDownloadContent(editor.getText({ blockSeparator: '\n' }))
                  setRawPrintContent(editor.getHTML())
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <div className='hidden print:block' dangerouslySetInnerHTML={{ __html: printContent }} />
    </>
  )
}
