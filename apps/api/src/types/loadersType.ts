import DataLoader from 'dataloader'
import { Types } from 'mongoose'
import { ProductDocument, UserDocument } from '.'

export interface DataLoaderParam {
  key: Types.ObjectId
  select: string
}

export interface DataLoaders {
  productLoader: DataLoader<DataLoaderParam, ProductDocument>
  userLoader: DataLoader<DataLoaderParam, UserDocument>
}
