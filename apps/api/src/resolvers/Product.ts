import {
  Resolver,
  ProductCreateArgs,
  ProductDocument,
  ProductByIdArgs,
  ProductUpdateArgs,
  PaginationArgs
} from '../types'
import { findDocument, paginateAndSort } from '../utils'

// Queries

const products: Resolver<PaginationArgs> = (_, args, { db }) => {
  const { Product } = db
  console.log(args.where)
  return paginateAndSort(Product.find(), args)
}

const product: Resolver<ProductByIdArgs> = async (_, arg, { db }) => {
  const { _id } = arg

  return findDocument<ProductDocument>({
    db,
    model: 'Product',
    field: '_id',
    value: _id
  })
}

// Mutation

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

export { product, products, createProduct, updateProduct, deleteProduct }
