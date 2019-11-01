import { Schema, Types } from 'mongoose'
import { Product } from '.'

export interface OrderItem {
  _id: Schema.Types.ObjectId
  product: Product
  quantity: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface OrderItemSubdocument extends OrderItem, Types.Embedded {
  _id: Schema.Types.ObjectId
}
