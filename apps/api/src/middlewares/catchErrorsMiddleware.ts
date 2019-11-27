import { IMiddlewareResolver } from 'graphql-middleware/dist/types'
import { Context } from '../types'
import { CustomError } from '../errors'
import { INTERNAL_SERVER_ERROR } from '../errors/MessageError'

const cathErrorsMiddleware: IMiddlewareResolver<any, Context> = async (
  resolve,
  ...args
) => {
  try {
    return await resolve(...args)
  } catch (err) {
    if (err instanceof CustomError) {
      throw err
    }
    throw new CustomError(INTERNAL_SERVER_ERROR)
  }
}

export { cathErrorsMiddleware }
