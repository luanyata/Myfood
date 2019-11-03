import { IMiddlewareResolver } from 'graphql-middleware/dist/types'
import { Context } from '../types'
import { CustomError } from '../errors'

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
    console.log('ERROR', err)
    throw new CustomError('Internal Server Error', 'INTERNAL_SERVER_ERROR')
  }
}

export { cathErrorsMiddleware }
