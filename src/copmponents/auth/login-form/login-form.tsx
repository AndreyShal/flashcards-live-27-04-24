import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ControlledCheckbox } from '@/copmponents/controlled/controlled-checkbox/controlled-checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '../../ui/button'
import { TextField } from '../../ui/text-field'

const isPasswordAtLeastChar = (password: string) => {
  return password?.length > 0
}

const passwordMinLengthShema = z.object({
  password: z.string().min(1, 'Password must be at least 1 characters'),
})

const passwordMaxLengthShema = z.object({
  password: z.string().max(8, 'Password must be at most 8 characters'),
})

const loginSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    rememberMe: z.literal(true, {
      errorMap: () => ({
        message: 'Please check the box',
      }),
    }),
  })
  .merge(passwordMinLengthShema)
  .merge(passwordMaxLengthShema)

type FormValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const [password1char, setPassword1char] = useState(false)
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormValues>({
    // mode: "onSubmit" //default
    // mode: 'onChange',"all" //not used!!!
    mode: 'onBlur', //not used!!!
    resolver: zodResolver(loginSchema),
  })
  const values = watch()

  const onSubmit = handleSubmit(data => {
    console.log(data)
    // console.log(data)
  })

  useEffect(() => {
    const pass = values.password

    if (isPasswordAtLeastChar(pass)) {
      setPassword1char(true)
    } else {
      setPassword1char(false)
    }
  }, [values])

  return (
    <form onSubmit={onSubmit}>
      password has to have at least 1 character: {password1char ? 'done' : 'bad'}
      <TextField {...register('email')} errorMessage={errors.email?.message} label={'email'} />
      <TextField
        {...register('password')}
        errorMessage={errors.password?.message}
        label={'password'}
      />
      <ControlledCheckbox control={control} label={'Remember me'} name={'rememberMe'} />
      {errors?.rememberMe?.message}
      <Button type={'submit'}>Submit</Button>
    </form>
  )
}
