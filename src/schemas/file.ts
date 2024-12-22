import { z } from 'zod'

export const fileSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  extension: z.string().min(1, 'File extension is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().positive('File size must be positive')
})
