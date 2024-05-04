import { FieldValues, UseControllerProps, useController } from 'react-hook-form'

import { Checkbox, CheckboxProps } from '@/copmponents/ui/checkbox'

export type ControlledCheckboxProps<T extends FieldValues> = Omit<
  CheckboxProps,
  'checked' | 'onChange'
> &
  Pick<UseControllerProps<T>, 'control' | 'name'>

export const ControlledCheckbox = <T extends FieldValues>({
  control,
  name,
  ...rest
}: ControlledCheckboxProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({
    control,
    name,
  })

  return <Checkbox {...rest} checked={value} id={name} onChange={onChange} />
}
