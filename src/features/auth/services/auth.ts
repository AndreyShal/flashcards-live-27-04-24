import { toast } from 'react-toastify'

import {
  LoginArgs,
  LoginResponse,
  RecoverPasswordRequest,
  SignUpArgs,
  UpdateProfileFormData,
  UserResponse,
} from './types.ts'

import { baseAPI } from '@/services/base-api.ts'

const authAPI = baseAPI.injectEndpoints({
  endpoints: builder => ({
    getMe: builder.query<UserResponse | null | { success: boolean }, void>({
      async queryFn(_name, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: `v1/auth/me`,
          method: 'GET',
        })

        if (result.error) {
          return { data: { success: false } }
        }

        return { data: result.data } as { data: UserResponse }
      },
      extraOptions: {
        maxRetries: 0,
      },
      providesTags: ['Me'],
    }),
    login: builder.mutation<LoginResponse, LoginArgs>({
      invalidatesTags: ['Me'],
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled

        if (!data) {
          return
        }

        console.log('login data', data)

        localStorage.setItem('accessToken', data.accessToken.trim())
        localStorage.setItem('refreshToken', data.refreshToken.trim())
      },
      query: body => ({
        body,
        method: 'POST',
        url: '/v1/auth/login',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `v1/auth/logout`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }),
      invalidatesTags: ['Me'],
      async onQueryStarted() {
        toast.info('You are successfully logged out', { containerId: 'common' })
        localStorage.clear()
      },
    }),
    updateProfile: builder.mutation<UserResponse, UpdateProfileFormData>({
      query: body => ({
        url: `v1/auth/me`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Me'],
    }),
    signUp: builder.mutation<UserResponse, SignUpArgs>({
      query: body => ({
        url: `v1/auth/sign-up`,
        method: 'POST',
        body,
      }),
    }),
    recoverPassword: builder.mutation<void, RecoverPasswordRequest>({
      query: body => ({
        url: 'v1/auth/recover-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `v1/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),
  }),
})

export const {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useSignUpMutation,
  useRecoverPasswordMutation,
  useResetPasswordMutation,
} = authAPI
