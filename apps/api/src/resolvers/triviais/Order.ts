import { Resolver, Order } from '../../types'
import { getFields } from '../../utils'
import { Types } from 'mongoose'

const user: Resolver<any, Order> = (order, args, { loaders }, info) => {
  const { userLoader } = loaders
  return userLoader.load({
    key: order.user as Types.ObjectId,
    select: getFields(info)
  })
}

export default {
  user
}
