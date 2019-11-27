import { ContextParameters } from 'graphql-yoga/dist/types'
import { createLoaders } from '../loaders'
import { models as db } from '../models'
import { Context } from '../types'
import { pubsub } from '.'
import { TypeModel } from '../enums'

const context = (ctx: ContextParameters): Context => {
  const loaders = createLoaders([TypeModel.PRODUCT, TypeModel.USER])
  return {
    ...ctx,
    authUser: null,
    db,
    loaders,
    pubsub
  }
}

export { context }
