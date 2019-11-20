import { compare, hash } from 'bcryptjs'
import { Resolver, UserSignUpArgs, UserSignInArgs } from '../types'

import { issueToken } from '../utils'
import { CustomError } from '../errors'

const signIn: Resolver<UserSignInArgs> = async (_, args, { db }) => {
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
  const token = issueToken({ sub, role })

  return { token, user }
}

const signUp: Resolver<UserSignUpArgs> = async (_, args, { db }) => {
  const { User } = db
  const { data } = args

  const password = await hash(data.password, 10)
  const user = await new User({
    ...data,
    password
  }).save()

  const { _id: sub, role } = user
  const token = issueToken({ sub, role })

  return { token, user }
}

export { signIn, signUp }
