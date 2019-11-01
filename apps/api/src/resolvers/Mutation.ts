import {
  Resolver,
  ProductCreateInput,
  ProductByIdInput,
  ProductUpdateInput
} from '../types'
import { checkExistence } from '../utils'

const createProduct: Resolver<ProductCreateInput> = (_, args, { db }) => {
  const { Product } = db
  const { data } = args
  const product = new Product(data)

  return product.save()
}

const updateProduct: Resolver<ProductUpdateInput> = async (_, args, { db }) => {
  const { Product } = db
  const { _id, data } = args

  await checkExistence({ db, model: 'Product', field: '_id', value: _id })
  return Product.findByIdAndUpdate(_id, data, { new: true })
}

const deleteProduct: Resolver<ProductByIdInput> = async (_, arg, { db }) => {
  const { Product } = db
  const { _id } = arg

  await checkExistence({ db, model: 'Product', field: '_id', value: _id })
  return Product.findByIdAndDelete(_id)
}

export default {
  createProduct,
  updateProduct,
  deleteProduct
}
