import { Resolver, ProductByIdInput } from '../types'
import { checkExistence } from '../utils'

const products: Resolver<{}> = (_, args, { db }) => db.Product.find()

const product: Resolver<ProductByIdInput> = async (_, arg, { db }) => {
  const { Product } = db
  const { _id } = arg

  await checkExistence({
    db,
    model: 'Product',
    field: '_id',
    value: _id
  })

  return Product.findById(_id)
}

export default {
  products,
  product
}
