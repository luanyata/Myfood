import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {
  Resolver,
  ProductCreateInput,
  ProductByIdInput,
  ProductUpdateInput,
  UserSignUpInput,
  UserSignInInput
} from '../types'
import { checkExistence } from '../utils'
import { CustomError } from '../errors'

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

const signIn: Resolver<UserSignInInput> = async (_, args, { db }) => {
  const { User } = db
  const { email, password } = args.data
  const err = new CustomError(
    'Invalid Credentials',
    'INVALID_CREDENTIALS_ERROR'
  )

  const user = await User.findOne({ email })

  if (!user) {
    throw err
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    throw err
  }

  const { _id: sub, role } = user
  const token = sign({ sub, role }, process.env.JWT_SECRET, { expiresIn: '2h' })

  return { token, user }
}

const signUp: Resolver<UserSignUpInput> = async (_, args, { db }) => {
  const { User } = db
  const { data } = args

  const password = await hash(data.password, 10)
  const user = await new User({
    ...data,
    password
  }).save()

  const { _id: sub, role } = user
  const token = sign({ sub, role }, process.env.JWT_SECRET, { expiresIn: '2h' })

  return { token, user }
}

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  signIn,
  signUp
}
