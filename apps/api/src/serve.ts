import { resolve } from 'path'
import { GraphQLServer } from 'graphql-yoga'
import { models as db } from './models'
import resolvers from './resolvers'
import { cathErrorsMiddleware } from './middlewares'

const typeDefs = resolve(__dirname, 'schema.graphql')

const server = new GraphQLServer({
  resolvers,
  typeDefs,
  context: { db },
  middlewares: [cathErrorsMiddleware]
})

export default server
