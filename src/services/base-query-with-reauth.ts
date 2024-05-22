import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { z } from 'zod'

const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.flashcards.andrii.es',
  // credentials: 'include',
  prepareHeaders: headers => {
    const token = localStorage.getItem('accessToken')

    if (headers.get('Authorization')) {
      return headers
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  },
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        const refreshResult = await baseQuery(
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            url: `v2/auth/refresh-token`,
            method: 'POST',
          },
          api,
          extraOptions
        )

        console.log(refreshResult)
        if (refreshResult.data) {
          const refreshResultParsed = refreshTokenResponseSchema.parse(refreshResult.data)

          localStorage.setItem('accessToken', refreshResultParsed.accessToken.trim())
          localStorage.setItem('refreshToken', refreshResultParsed.refreshToken.trim())
        }

        result = await baseQuery(args, api, extraOptions)
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
