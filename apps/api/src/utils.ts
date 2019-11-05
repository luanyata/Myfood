import { Document, Types, Model } from 'mongoose'
import { CheckExistenceOptions, TokenPayload } from './types'
import { CustomError } from './errors'
import { SignOptions, sign } from 'jsonwebtoken'

const isMongoId = (value: string): boolean => Types.ObjectId.isValid(value)

const findDocument = async <T extends Document>(
  opts: CheckExistenceOptions
): Promise<T> => {
  const {
    model,
    db,
    field,
    where,
    value,
    message,
    errorCode,
    extensions
  } = opts
  // TODO Criar Enum de Status Code
  if (field === '_id' && !isMongoId(value)) {
    throw new CustomError(`Invalid ID value for ${value}!`, 'INVALID_ID_ERROR')
  }

  const document = await ((db[model] as unknown) as Model<T>)
    .findOne(where || { [field]: value })
    .exec()

  if (!document) {
    throw new CustomError(
      message || `${model} with ${field} '${value}' not found!`,
      errorCode || 'NOT_FOUND_ERROR',
      extensions
    )
  }

  return document
}

const issueToken = (payload: TokenPayload, options?: SignOptions): string =>
  sign(payload, process.env.JWT_SECRET, { expiresIn: '2h', ...options })

export { isMongoId, findDocument, issueToken }
