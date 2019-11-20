import { Resolver, Order } from '../../types'

const user: Resolver<any, Order> = (order, args, { db }) =>
  db.User.findById(order.user)

export default { user }
