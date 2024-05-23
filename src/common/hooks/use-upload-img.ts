import { useState } from 'react'

import {
  UseFormGetFieldState,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  UseFormResetField,
  Path,
} from 'react-hook-form'
import { toast } from 'react-toastify'

import defImg from '@/assets/images/default-image.jpg'
import { PackFormType } from '@/components/forms/pack'

type UploadImgType<TFieldValues extends PackFormType> = {
  getFieldState: UseFormGetFieldState<TFieldValues>
  name: Path<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  trigger: UseFormTrigger<TFieldValues>
  watch: UseFormWatch<TFieldValues>
  defaultCover?: string | null
}

export const useUploadImg = <TFieldValues extends PackFormType>({
  getFieldState,
  name,
  resetField,
  setValue,
  trigger,
  watch,
  defaultCover,
}: UploadImgType<TFieldValues>) => {
  const [downloaded, setDownloaded] = useState<null | string>(defaultCover || null)
  const [coverError, setCoverError] = useState<null | string>(null)

  const deleteCoverHandler = () => {
    if (coverError) {
      setCoverError(null)
    }
    setValue(name, null as any)
    setDownloaded(null)
  }

  const extraActions = async () => {
    const success = await trigger(name)
    const { error } = getFieldState(name)
    const file = watch(name)

    if (!success && error?.message) {
      toast.error(error.message, { containerId: 'modal' })
      setCoverError(error.message)
      resetField(name)
    }

    if (file) {
      const img = success ? URL.createObjectURL(file as Blob) : defImg

      setDownloaded(img)

      if (coverError && !error?.message) {
        setCoverError(null)
      }
    }
  }

  return { coverError, deleteCoverHandler, downloaded, extraActions }
}
