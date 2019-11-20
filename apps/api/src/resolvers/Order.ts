import {
  Resolver,
  OrderCreateArgs,
  UserRole,
  OrderDeleteArgs,
  OrderDocument,
  OrderUpdateArgs,
  OrderByIdArgs,
  PaginationArgs
} from '../types'
import { findDocument, findOrderItem, paginateAndSort } from '../utils'

import { Types } from 'mongoose'

// Queries

const orders: Resolver<PaginationArgs> = (_, args, { db, authUser }) => {
  const { _id, role } = authUser
  const { Order } = db

  const conditions = role === UserRole.USER ? { user: _id } : {}

  return paginateAndSort(Order.find(conditions), args)
}

const order: Resolver<OrderByIdArgs> = (_, args, { db, authUser }) => {
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

// Mutations

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

export { order, orders, createOrder, deleteOrder, updateOrder }
