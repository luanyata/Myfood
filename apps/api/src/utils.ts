import { Types } from 'mongoose'
import { CheckExistenceOptions } from './types'
import { CustomError } from './errors'

const isMongoId = (value: string): boolean => Types.ObjectId.isValid(value)

const checkExistence = async (
  opts: CheckExistenceOptions
): Promise<boolean> => {
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

  const exists = await db[model].exists(where || { [field]: value })

  if (!exists) {
    throw new CustomError(
      message || `${model} with ${field} '${value}' not found!`,
      errorCode || 'NOT_FOUND_ERROR',
      extensions
    )
  }

  return exists
}

export { isMongoId, checkExistence }
