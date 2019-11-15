import {
  Resolver,
  ProductByIdInput,
  UserRole,
  ProductDocument,
  OrderByIdInput,
  OrderDocument
} from '../types'
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

const order: Resolver<OrderByIdInput> = (_, args, { db, authUser }) => {
  const { _id } = args
  const { _id: userId, role } = authUser
  const where = role === UserRole.USER ? { user: userId, _id } : null

  return findDocument<OrderDocument>({
    db,
    model: 'Order',
    field: '_id',
    value: _id,
    where
  })
}

export default {
  orders,
  order,
  products,
  product
}
