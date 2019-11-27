import { IMiddlewareResolver } from 'graphql-middleware/dist/types'
import { Context } from '../types'

const logMiddleware: IMiddlewareResolver<any, Context> = (
  resolve,
  source,
  args,
  ctx,
  info
) => resolve(source, args, ctx, info)

export { logMiddleware }
