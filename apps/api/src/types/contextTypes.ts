import { AuthUser, Models } from '.'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { DataLoaders } from './loadersType'

export interface Context extends ContextParameters {
  authUser: AuthUser
  db: Models
  pubsub: RedisPubSub
  loaders: DataLoaders
}
