import { AuthUser, Models } from '.'
import { ContextParameters } from 'graphql-yoga/dist/types'
import { PubSub } from 'graphql-yoga'

export interface Context extends ContextParameters {
  authUser: AuthUser
  db: Models
  pubsub: PubSub
}
