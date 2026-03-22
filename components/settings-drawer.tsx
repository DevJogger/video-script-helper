'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Slider } from '@/components/ui/slider'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/model/store-provider'

interface SettingsDrawerProps {
  children: React.ReactNode
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ children }) => {
  const pronunciationHints = useSettingsStore((state) => state.pronunciationHints)
  const updatePronunciationHint = useSettingsStore((state) => state.updatePronunciationHint)
  const rubyAnnotation = useSettingsStore((state) => state.rubyAnnotation)
  const toggleRubyAnnotation = useSettingsStore((state) => state.toggleRubyAnnotation)
  const subtitleBreakPosition = useSettingsStore((state) => state.subtitleBreakPosition)
  const setSubtitleBreakPosition = useSettingsStore((state) => state.setSubtitleBreakPosition)

  return (
    <Drawer direction='top'>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>設置</DrawerTitle>
        </DrawerHeader>
        <section className='flex flex-col items-center gap-2 p-2'>
          <DrawerDescription className='text-base'>粵語發音提示 (beta)</DrawerDescription>
          <FieldGroup className='flex-row items-center justify-center gap-8'>
            {pronunciationHints.map((item) => {
              const hint = Object.keys(item)[0]
              const value = item[hint]
              return (
                <Field key={hint} orientation='horizontal' className='w-fit gap-2'>
                  <FieldLabel htmlFor={hint}>{hint}</FieldLabel>
                  <Switch
                    id={hint}
                    checked={value}
                    onCheckedChange={() => updatePronunciationHint(hint)}
                  />
                </Field>
              )
            })}
          </FieldGroup>
        </section>
        <section className='flex flex-col items-center gap-2 p-2'>
          <DrawerDescription className='text-base'>打印設置</DrawerDescription>
          <Field orientation='horizontal' className='w-fit gap-2'>
            <FieldLabel htmlFor='ruby-annotation'>打印國語稿時添加拼音注音</FieldLabel>
            <Switch
              id='ruby-annotation'
              checked={rubyAnnotation}
              onCheckedChange={toggleRubyAnnotation}
            />
          </Field>
        </section>
        <section className='flex flex-col items-center gap-2 p-2'>
          <DrawerDescription className='text-base'>字幕設置</DrawerDescription>
          <Field orientation='vertical' className='w-fit gap-3'>
            <FieldLabel htmlFor='subtitle-break-position'>{`字幕換行提示位置: ${subtitleBreakPosition}個中文字`}</FieldLabel>
            <Slider
              className='w-full'
              id='subtitle-break-position'
              defaultValue={[subtitleBreakPosition]}
              max={20}
              step={1}
              onValueChange={(value) => setSubtitleBreakPosition(value[0])}
            />
          </Field>
        </section>
        <DrawerFooter className='items-center justify-center'>
          <DrawerClose asChild>
            <Button className='w-24'>確認</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default SettingsDrawer
