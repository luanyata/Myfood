import { GraphQLResolveInfo } from 'graphql'
import { fieldsList } from 'graphql-fields-list'
import { SignOptions, sign } from 'jsonwebtoken'
import { Document, DocumentQuery, Model, Types } from 'mongoose'
import {
  FindDocumentOptions,
  GetFieldsOptions,
  OrderItemSubdocument,
  PaginationArgs,
  TokenPayload
} from './types'
import { CustomError } from './errors'
import {
  INVALID_ID_ERRO,
  INVALID_ID_CONDITION_ERROR,
  NOT_FOUND_ERROR,
  INVALID_ID_VALUE,
  DOCUMENT_NOT_FOUND_ERROR
} from './errors/MessageError'

const isMongoId = (value: string): boolean => Types.ObjectId.isValid(value)

const findDocument = async <T extends Document>(
  opts: FindDocumentOptions
): Promise<T> => {
  const {
    model,
    db,
    field,
    value,
    where,
    message,
    errorCode,
    extensions,
    select
  } = opts

  if (field === '_id' && !isMongoId(value)) {
    throw new CustomError(INVALID_ID_ERRO(value))
  }

  const document = await ((db[model] as unknown) as Model<T>)
    .findOne(where || { [field]: value })
    .select(select)
    .exec()

  if (!document) {
    const error = DOCUMENT_NOT_FOUND_ERROR(model, field, value)

    error.message = message || error.message
    error.code = errorCode || error.code

    throw new CustomError(error, extensions)
  }

  return document
}

const issueToken = (payload: TokenPayload, options?: SignOptions): string =>
  sign(payload, process.env.JWT_SECRET, { expiresIn: '2h', ...options })

const findOrderItem = (
  items: Types.DocumentArray<OrderItemSubdocument>,
  _id: string,
  operation: 'update' | 'delete'
): OrderItemSubdocument => {
  if (!isMongoId(_id)) {
    throw new CustomError(INVALID_ID_VALUE(_id, operation))
  }

  const item = items.id(_id)

  if (!item) {
    throw new CustomError(NOT_FOUND_ERROR(_id, operation))
  }

  return item
}

const paginateAndSort = <TDoc extends Document>(
  query: DocumentQuery<TDoc[], TDoc>,
  args: PaginationArgs
): DocumentQuery<TDoc[], TDoc> => {
  const { skip = 0, limit = 10, orderBy = [] } = args
  return query
    .skip(skip)
    .limit(limit <= 20 ? limit : 20)
    .sort(orderBy.join(' '))
}

const buildOrderByResolvers = (fields: string[]): Record<string, string> =>
  fields.reduce(
    (resolvers, field) => ({
      ...resolvers,
      [`${field}_ASC`]: field,
      [`${field}_DESC`]: `-${field}`
    }),
    {}
  )

const operators = [
  { name: 'Eq', op: '$eq' },
  { name: 'Ne', op: '$ne' },
  { name: 'Lt', op: '$lt' },
  { name: 'Lte', op: '$lte' },
  { name: 'Gt', op: '$gt' },
  { name: 'Gte', op: '$gte' },
  { name: 'In', op: '$in' },
  { name: 'Nin', op: '$nin' },
  { name: 'Regex', op: '$regex' },
  { name: 'Options', op: '$options' }
]

const idFields = ['user']

const buildConditions = (
  where: Record<string, any> = {}
): Record<string, any> =>
  Object.keys(where).reduce((conditions, whereKey) => {
    if (idFields.some(idField => whereKey.includes(idField))) {
      const ids: string[] = Array.isArray(where[whereKey])
        ? where[whereKey]
        : [where[whereKey]]

      if (ids.some(id => !isMongoId(id))) {
        throw new CustomError(INVALID_ID_CONDITION_ERROR(whereKey))
      }
    }

    const operator = operators.find(({ name }) =>
      new RegExp(`${name}$`).test(whereKey)
    )

    const fieldName = operator
      ? whereKey.replace(operator.name, '') // price
      : '$' + whereKey.toLowerCase() // $or

    const fieldValue = operator
      ? { ...conditions[fieldName], [operator.op]: where[whereKey] }
      : where[whereKey].map(buildConditions)

    return {
      ...conditions,
      [fieldName]: fieldValue
    }
  }, {})

const getFields = (
  info: GraphQLResolveInfo,
  options?: GetFieldsOptions
): string => {
  let fields = fieldsList(info)
  if (options) {
    const { include = [], skip = [] } = options
    fields = fields.concat(include)
    fields = fields.filter(f => !skip.includes(f))
  }
  return fields.join(' ')
}

export {
  buildConditions,
  buildOrderByResolvers,
  findDocument,
  findOrderItem,
  getFields,
  isMongoId,
  issueToken,
  paginateAndSort
}
