import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormCheckbox } from '@/copmponents/ui/form/form-checkbox'
import { FormTextfield } from '@/copmponents/ui/form/form-textfield'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '../../ui/button'

const isPasswordAtLeastChar = (password: string) => {
  return password?.length > 0
}

const passwordMinLengthShema = z.object({
  password: z.string().min(3, 'Password must be at least 1 characters'),
})

const passwordMaxLengthShema = z.object({
  password: z.string().max(30, 'Password must be at most 8 characters'),
})

const loginSchema = z
  .object({
    email: z.string().trim().email('Please enter a valid email'),
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
    // register,
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
    <>
      {import.meta.env.DEV && <DevTool control={control} />}
      <form onSubmit={onSubmit}>
        password has to have at least 1 character: {password1char ? 'done' : 'bad'}
        <FormTextfield control={control} label={'email'} name={'email'} />
        <FormTextfield control={control} label={'password'} name={'password'} />
        <FormCheckbox control={control} label={'Remember me'} name={'rememberMe'} />
        {errors?.rememberMe?.message}
        <Button type={'submit'}>Submit</Button>
      </form>
    </>
  )
}
