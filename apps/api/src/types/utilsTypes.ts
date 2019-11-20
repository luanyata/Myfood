import { Models, UserRole } from '.'
import { Types } from 'mongoose'

export interface FindDocumentOptions {
  model: keyof Models
  db: Models
  field?: string
  value?: any
  message?: string
  where?: Record<string, any>
  errorCode?: string
  extensions?: Record<string, any>
}

export interface TokenPayload {
  sub: Types.ObjectId
  role: UserRole
}
