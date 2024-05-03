import { FC } from 'react'

import { Icon } from '@/copmponents/ui/icon/icon'
import { Typography } from '@/copmponents/ui/typography'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { clsx } from 'clsx'

import s from './checkbox.module.scss'

export type CheckboxProps = {
  checked: boolean
  className?: string
  disabled?: boolean
  id?: string
  label?: string
  onChange: (checked: boolean) => void
}

export const Checkbox: FC<CheckboxProps> = props => {
  const { checked, className, disabled, id, label, onChange } = props

  const classes = {
    checkbox: s.checkbox,
    root: clsx(s.label, disabled && s.disabled, className),
  }

  return (
    <Typography as={'label'} className={classes.root}>
      <RadixCheckbox.Root
        checked={checked}
        className={classes.checkbox}
        disabled={disabled}
        id={id}
        onCheckedChange={onChange}
      >
        <div className={s.frame}></div>
        {checked && (
          <RadixCheckbox.Indicator className={s.indicator} forceMount>
            <Icon name={'checked'} />
          </RadixCheckbox.Indicator>
        )}
      </RadixCheckbox.Root>
      {label}
    </Typography>
  )
}
