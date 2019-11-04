import { ContextParameters } from 'graphql-yoga/dist/types'
import { models as db } from '../models'
import { Context } from '../types'

const context = (ctx: ContextParameters): Context => {
  return {
    ...ctx,
    authUser: null,
    db
  }
}

export { context }
