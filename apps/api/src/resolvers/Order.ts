import {
  Resolver,
  OrderCreateArgs,
  UserRole,
  OrderDeleteArgs,
  OrderDocument,
  OrderUpdateArgs,
  OrderByIdArgs,
  PaginationArgs,
  MutationType
} from '../types'
import {
  findDocument,
  findOrderItem,
  paginateAndSort,
  buildConditions,
  getFields
} from '../utils'

import { Types } from 'mongoose'

// Queries

const orders: Resolver<PaginationArgs> = (_, args, { db, authUser }, info) => {
  const { _id, role } = authUser
  const { Order } = db
  let conditions = buildConditions(args.where)
  conditions =
    role === UserRole.USER ? { ...conditions, user: _id } : conditions
  const query = Order.find(conditions).select(getFields(info))
  return paginateAndSort(query, args)
}

const order: Resolver<OrderByIdArgs> = (_, args, { db, authUser }, info) => {
  const { _id } = args
  const { _id: userId, role } = authUser
  const where = role === UserRole.USER ? { user: userId, _id } : null
  return findDocument<OrderDocument>({
    db,
    model: 'Order',
    field: '_id',
    value: _id,
    where,
    select: getFields(info)
  })
}

// Mutations

const createOrder: Resolver<OrderCreateArgs> = async (
  _,
  args,
  { db, authUser, pubsub }
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

  pubsub.publish('ORDER_CREATED', {
    mutation: MutationType.CREATED,
    node: order
  })

  return order
}

const deleteOrder: Resolver<OrderDeleteArgs> = async (
  _,
  args,
  { db, authUser, pubsub },
  info
) => {
  const { _id } = args
  const { _id: userId, role } = authUser

  const where = role === UserRole.USER ? { _id, user: userId } : null
  const order = await findDocument<OrderDocument>({
    db,
    model: 'Order',
    field: '_id',
    value: _id,
    where,
    select: getFields(info, { include: ['user'] })
  })

  await order.remove()

  pubsub.publish('ORDER_DELETED', {
    mutation: MutationType.DELETED,
    node: order
  })

  return order
}

const updateOrder: Resolver<OrderUpdateArgs> = async (
  _,
  args,
  { db, authUser, pubsub },
  info
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
    where,
    select: getFields(info, { include: ['user', 'items', 'status'] })
  })

  const user = !isAdmin ? userId : data.user || order.user

  const {
    itemsToUpdate = [],
    itemsToDelete = [],
    itemsToAdd = [],
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
        total: foundItem.total + itemToAdd.total
      })
    }

    order.items.push(itemToAdd)
  })

  const total = order.items.reduce((sum, item) => sum + item.total, 0)

  order.user = user
  order.status = status || order.status
  order.total = total

  await order.save()

  pubsub.publish('ORDER_UPDATED', {
    mutation: MutationType.UPDATED,
    node: order
  })

  return order
}

export { order, orders, createOrder, deleteOrder, updateOrder }
