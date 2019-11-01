import { Document, Schema } from 'mongoose'
import { OmitId } from '.'

export interface Product {
  _id: Schema.Types.ObjectId
  name: string
  description: string
  price: number
  unit: string
}

export interface ProductDocument extends Product, Document {
  _id: Schema.Types.ObjectId
}

export interface ProductCreateInput {
  data: OmitId<Product>
}

export interface ProductByIdInput {
  _id: Schema.Types.ObjectId
}

export interface ProductUpdateInput
  extends ProductCreateInput,
    ProductByIdInput {}
