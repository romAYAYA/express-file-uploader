import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const isValidPhoneNumber = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value)
  return phoneNumber?.isValid() || false
}

export const SignupSchema = z.object({
  id: z.string()
    .refine(isValidPhoneNumber, { message: 'ID must be a valid phone number' }),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

export const SigninSchema = z.object({
  id: z.string()
    .refine(isValidPhoneNumber, { message: 'ID must be a valid phone number' }),
  password: z.string().min(1, 'Password is required')
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})
