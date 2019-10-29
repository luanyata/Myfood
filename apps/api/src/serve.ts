import { resolve } from 'path'
import { GraphQLServer } from 'graphql-yoga'

const typeDefs = resolve(__dirname, 'schema.graphql')

const USERS = [
  { id: 1, name: 'Luan', email: 'luan@yata.com' },
  { id: 2, name: 'Fernanda', email: 'fernanda@yata.com' }
]

const resolvers = {
  User: {
    name: (parent): string => {
      console.log(parent)
      return `User: ${parent.name}`
    }
  },
  Query: {
    users: (): typeof USERS => USERS
  },
  Mutation: {
    createUser: (parent, args): typeof USERS[0] => {
      const { userInput } = args
      const user = {
        ...userInput,
        id: USERS.length + 1
      }
      USERS.push(user)
      return user
    }
  }
}

const serve = new GraphQLServer({
  resolvers,
  typeDefs
})

export default serve
