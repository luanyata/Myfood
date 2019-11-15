import { Document, Schema, Types } from 'mongoose'
import { OrderItemSubdocument, User } from '.'

export enum OrderStatus {
  WAITING_PAYMENT,
  IN_QUEUE,
  PREPARING,
  READY,
  ON_THE_WAY,
  DELIVERED
}

export interface Order {
  _id: Schema.Types.ObjectId
  user: User
  total: number
  status: OrderStatus
  items: Types.DocumentArray<OrderItemSubdocument>
  createdAt: string
  updatedAt: string
}

export interface OrderDocument extends Order, Document {
  _id: Schema.Types.ObjectId
}

export interface OrderByIdInput {
  _id: Schema.Types.ObjectId
}
