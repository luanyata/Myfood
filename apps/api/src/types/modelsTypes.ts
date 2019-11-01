import { Model } from 'mongoose'
import { OrderDocument, ProductDocument, UserDocument } from '.'

export interface Models {
  Order: Model<OrderDocument>
  Product: Model<ProductDocument>
  User: Model<UserDocument>
}
