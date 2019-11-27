import { withFilter } from 'graphql-yoga'
import {
  SubscriptionArgs,
  SubscriptionResolver,
  Order,
  UserRole,
  Resolver,
  SubscriptionPayload
} from '../types'

const orderSubscribeFn: Resolver<SubscriptionArgs> = (_, args, ctx) => {
  const { mutationIn } = args.where
  const { pubsub } = ctx

  const channels = mutationIn.map(m => `ORDER_${m}`)
  return pubsub.asyncIterator(channels)
}

const orderFilterFn: Resolver<SubscriptionArgs, SubscriptionPayload<Order>> = (
  payload,
  args,
  ctx
) => {
  const { _id, role } = ctx.authUser
  return role === UserRole.ADMIN ? true : payload.node.user === _id
}

const order: SubscriptionResolver<Order> = {
  subscribe: withFilter(orderSubscribeFn, orderFilterFn),
  resolve: payload => payload
}

export default {
  order
}
