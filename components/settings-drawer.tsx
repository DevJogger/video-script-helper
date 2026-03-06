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

  return (
    <Drawer direction='top'>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>設置</DrawerTitle>
        </DrawerHeader>
        <section className='flex flex-col items-center gap-2 p-2'>
          <DrawerDescription>粵語發音提示 (beta)</DrawerDescription>
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
