import { Document, Schema } from 'mongoose'

export enum UserRole {
  USER,
  ADMIN
}

export interface User {
  _id: Schema.Types.ObjectId
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UserDocument extends User, Document {
  _id: Schema.Types.ObjectId
}
