import { Resolver, OrderItem } from '../types'
import { getFields } from '../utils'
import { Types } from 'mongoose'

const product: Resolver<any, OrderItem> = (
  orderItem,
  args,
  { loaders },
  info
) => {
  const { productLoader } = loaders
  return productLoader.load({
    key: orderItem.product as Types.ObjectId,
    select: getFields(info)
  })
}

export default { product }
