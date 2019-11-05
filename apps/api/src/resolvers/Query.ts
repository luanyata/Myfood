import { Resolver, ProductByIdInput, UserRole, ProductDocument } from '../types'
import { findDocument } from '../utils'

const products: Resolver<{}> = (_, args, { db }) => db.Product.find()

const product: Resolver<ProductByIdInput> = async (_, arg, { db }) => {
  const { _id } = arg

  return findDocument<ProductDocument>({
    db,
    model: 'Product',
    field: '_id',
    value: _id
  })
}

const orders: Resolver<{}> = (_, args, { db, authUser }) => {
  const { _id, role } = authUser
  const { Order } = db

  const conditions = role === UserRole.USER ? { user: _id } : {}

  return Order.find(conditions)
}

export default {
  orders,
  products,
  product
}
