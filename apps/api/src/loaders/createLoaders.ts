import DataLoader from 'dataloader'
import { Document, Model, Types } from 'mongoose'
import { models as db } from '../models'
import { DataLoaders, DataLoaderParam, Models } from '../types'

const batchLoadFn = async (
  model: Model<Document>,
  params: DataLoaderParam[]
): Promise<Document[]> => {
  const ids = params.map(param => param.key)
  const { select } = params[0]

  const documents = await model
    .find({ _id: { $in: ids } })
    .select(select)
    .exec()

  const documentsMap = documents.reduce(
    (prev, document) => ({
      ...prev,
      [document._id.toHexString()]: document
    }),
    {} as { [key: string]: Document }
  )

  return ids.map(id => documentsMap[id.toHexString()])
}

const createLoaders = (modelsNames: (keyof Models)[]): DataLoaders =>
  modelsNames.reduce((loaders, modelName) => {
    const loaderName = `${modelName.toLowerCase()}Loader`
    return {
      ...loaders,
      [loaderName]: new DataLoader<DataLoaderParam, Document>(
        (params): Promise<Document[]> => batchLoadFn(db[modelName], params),
        {
          cacheKeyFn: (param: DataLoaderParam): Types.ObjectId => param.key
        }
      )
    }
  }, {} as DataLoaders)

export { createLoaders }
