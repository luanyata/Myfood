import { Models, UserRole } from '.'
import { Schema } from 'mongoose'

export interface CheckExistenceOptions {
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
  sub: Schema.Types.ObjectId
  role: UserRole
}
