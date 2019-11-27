import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis, { RedisOptions } from 'ioredis'
import { Server } from '../enums'

const { REDIS_HOST = Server.REDIS, REDIS_PORT = 6379 } = process.env
const options: RedisOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT as number
}
const publisher = new Redis(options)
const subscriber = new Redis(options)

const pubsub = new RedisPubSub({
  publisher,
  subscriber
})

export { pubsub }
