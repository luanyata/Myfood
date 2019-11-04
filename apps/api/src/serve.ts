import { resolve } from 'path'
import { GraphQLServer } from 'graphql-yoga'
import { context } from './config'
import resolvers from './resolvers'
import { cathErrorsMiddleware } from './middlewares'
import { AuthDirective } from './directives/AuthDirective'

const typeDefs = resolve(__dirname, 'schema.graphql')

const server = new GraphQLServer({
  resolvers,
  typeDefs,
  context,
  middlewares: [cathErrorsMiddleware],
  schemaDirectives: {
    auth: AuthDirective
  }
})

export default server
