import { compare, hash } from 'bcryptjs'
import {
  Resolver,
  ProductCreateArgs,
  ProductByIdArgs,
  ProductUpdateArgs,
  UserSignUpArgs,
  UserSignInArgs,
  ProductDocument,
  OrderCreateArgs,
  UserRole,
  OrderDeleteArgs,
  OrderDocument,
  OrderUpdateArgs
} from '../types'
import { findDocument, issueToken, findOrderItem } from '../utils'
import { CustomError } from '../errors'
import { Types } from 'mongoose'

const createProduct: Resolver<ProductCreateArgs> = (_, args, { db }) => {
  const { Product } = db
  const { data } = args
  const product = new Product(data)

  return product.save()
}

const updateProduct: Resolver<ProductUpdateArgs> = async (_, args, { db }) => {
  const { _id, data } = args

  const product = await findDocument<ProductDocument>({
    db,
    model: 'Product',
    field: '_id',
    value: _id
  })

  Object.keys(data).forEach(prop => (product[prop] = data[prop]))

  return product.save()
}

const deleteProduct: Resolver<ProductByIdArgs> = async (_, arg, { db }) => {
  const { _id } = arg

  const product = await findDocument<ProductDocument>({
    db,
    model: 'Product',
    field: '_id',
    value: _id
  })
  return product.remove()
}

const signIn: Resolver<UserSignInArgs> = async (_, args, { db }) => {
  const { User } = db
  const { email, password } = args.data
  const err = new CustomError(
    'Invalid Credentials',
    'INVALID_CREDENTIALS_ERROR'
  )

  const user = await User.findOne({ email })

  if (!user) {
    throw err
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    throw err
  }

  const { _id: sub, role } = user
  const token = issueToken({ sub, role })

  return { token, user }
}

const signUp: Resolver<UserSignUpArgs> = async (_, args, { db }) => {
  const { User } = db
  const { data } = args

  const password = await hash(data.password, 10)
  const user = await new User({
    ...data,
    password
  }).save()

  const { _id: sub, role } = user
  const token = issueToken({ sub, role })

  return { token, user }
}

const createOrder: Resolver<OrderCreateArgs> = async (
  _,
  args,
  { db, authUser }
) => {
  const { data } = args
  const { _id, role } = authUser
  const { Order } = db

  const user = role === UserRole.USER ? _id : data.user || _id

  const total =
    (data &&
      data.items &&
      data.items.reduce((sum, item) => sum + item.total, 0)) ||
    0

  const order = await new Order({
    ...data,
    total,
    user
  }).save()

  return order
}

const deleteOrder: Resolver<OrderDeleteArgs> = async (
  _,
  args,
  { db, authUser }
) => {
  const { _id } = args
  const { _id: userId, role } = authUser

  const where = role === UserRole.USER ? { _id, user: userId } : null

  const order = await findDocument<OrderDocument>({
    db,
    model: 'Order',
    field: '_id',
    value: _id,
    where
  })

  return order.remove()
}

const updateOrder: Resolver<OrderUpdateArgs> = async (
  _,
  args,
  { db, authUser }
) => {
  const { data, _id } = args
  const { _id: userId, role } = authUser

  const isAdmin = role === UserRole.ADMIN

  const where = !isAdmin ? { _id, user: userId } : null

  const order = await findDocument<OrderDocument>({
    db,
    model: 'Order',
    field: '_id',
    value: _id,
    where
  })

  const user = !isAdmin ? userId : data.user || order.user

  const {
    itemsToAdd = [],
    itemsToUpdate = [],
    itemsToDelete = [],
    status
  } = args.data

  const foundItemsToUpdate = itemsToUpdate.map(orderItem =>
    findOrderItem(order.items, orderItem._id, 'update')
  )

  const foundItemsToDelete = itemsToDelete.map(orderItemId =>
    findOrderItem(order.items, orderItemId, 'delete')
  )

  foundItemsToUpdate.forEach((orderItem, index) =>
    orderItem.set(itemsToUpdate[index])
  )

  foundItemsToDelete.forEach(orderItem => orderItem.remove())

  itemsToAdd.forEach(itemToAdd => {
    const foundItem = order.items.find(item =>
      (item.product as Types.ObjectId).equals(itemToAdd.product)
    )

    if (foundItem) {
      return foundItem.set({
        quantity: foundItem.quantity + itemToAdd.quantity,
        total: foundItem.total + order.total
      })
    }

    order.items.push(itemToAdd)
  })

  const total = order.items.reduce((sum, item) => sum + item.total, 0)
  order.user = user
  order.total = total
  order.status = status || order.status

  return order.save()
}

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  updateOrder,
  deleteOrder,
  signIn,
  signUp
}
