import {
  Resolver,
  ProductCreateArgs,
  ProductDocument,
  ProductByIdArgs,
  ProductUpdateArgs,
  PaginationArgs
} from '../types'
import {
  findDocument,
  paginateAndSort,
  buildConditions,
  getFields
} from '../utils'

// Queries

const products: Resolver<PaginationArgs> = (_, args, { db }, info) => {
  const { Product } = db
  const conditions = buildConditions(args.where)
  const query = Product.find(conditions).select(getFields(info))
  return paginateAndSort(query, args)
}

const product: Resolver<ProductByIdArgs> = (_, args, { db }, info) => {
  const { _id } = args
  return findDocument<ProductDocument>({
    db,
    model: 'Product',
    field: '_id',
    value: _id,
    select: getFields(info)
  })
}

// Mutation

const createProduct: Resolver<ProductCreateArgs> = (_, args, { db }) => {
  const { Product } = db
  const { data } = args
  const product = new Product(data)
  return product.save()
}

const updateProduct: Resolver<ProductUpdateArgs> = async (
  _,
  args,
  { db },
  info
) => {
  const { _id, data } = args
  const product = await findDocument<ProductDocument>({
    db,
    model: 'Product',
    field: '_id',
    value: _id,
    select: getFields(info)
  })
  Object.keys(data).forEach(prop => (product[prop] = data[prop]))
  return product.save()
}

const deleteProduct: Resolver<ProductByIdArgs> = async (
  _,
  args,
  { db },
  info
) => {
  const { _id } = args
  const product = await findDocument<ProductDocument>({
    db,
    model: 'Product',
    field: '_id',
    value: _id,
    select: getFields(info)
  })
  return product.remove()
}

export { product, products, createProduct, updateProduct, deleteProduct }
