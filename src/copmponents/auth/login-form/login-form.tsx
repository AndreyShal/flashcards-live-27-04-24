import { useController, useForm } from 'react-hook-form'

import { Checkbox } from '@/copmponents/ui/checkbox'

import { Button } from '../../ui/button'
import { TextField } from '../../ui/text-field'

type FormValues = {
  email: string
  password: string
  rememberMe: boolean
}

export const LoginForm = () => {
  const { control, handleSubmit, register } = useForm<FormValues>()

  const onSubmit = (data: FormValues) => {
    console.log(data)
    // console.log(data)
  }

  const {
    field: { onChange, value },
  } = useController({
    control,
    defaultValue: false,
    name: 'rememberMe',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('email')} label={'email'} />
      <TextField {...register('password')} label={'password'} />
      {/*<Checkbox {...register('rememberMe')} label={'remember me'} />*/}
      <Checkbox checked={value} label={'remember me'} onChange={onChange} />
      <Button type={'submit'}>Submit</Button>
    </form>
  )
}
