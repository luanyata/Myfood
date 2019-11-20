import { Resolver, OrderItem } from '../types'

const product: Resolver<any, OrderItem> = (ordemItem, args, { db }) =>
  db.Product.findById(ordemItem.product)

export default { product }
