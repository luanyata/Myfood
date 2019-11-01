import mongoose from 'mongoose'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import { Models } from '../types'

const { MONGO_URI } = process.env

const connect = (): Promise<typeof mongoose> =>
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

const models: Models = Object.create({})

readdirSync(__dirname)
  .filter(fileName => !fileName.includes('index'))
  .forEach(fileName => {
    const model = require(resolve(__dirname, fileName)).default
    const modelName = fileName
      .split('.')
      .shift()
      .replace('Model', '')

    models[modelName] = model
  })

export { connect, models }
