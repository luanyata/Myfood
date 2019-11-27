import { StateError } from '../types/statusErrorTypes'

export const UNAUTHORIZED_ERROR = {
  message: 'Unauthorized',
  code: 'UNAUTHORIZED_ERROR'
}

export const INVALID_TOKEN_ERROR = {
  message: 'Invalid Token!',
  code: 'INVALID_TOKEN_ERROR'
}

export const INTERNAL_SERVER_ERROR = {
  message: 'Internal Server Error',
  code: 'INTERNAL_SERVER_ERROR'
}

export const INVALID_CREDENTIALS_ERROR = {
  message: 'Invalid Credentials',
  code: 'INVALID_CREDENTIALS_ERROR'
}

export const INVALID_ID_ERRO = (value: string): StateError => {
  return {
    message: `Invalid ID value for '${value}'!`,
    code: 'INVALID_ID_ERROR'
  }
}

export const INVALID_ID_CONDITION_ERROR = (whereKey: string): StateError => {
  return {
    message: `Invalid ID value for condition '${whereKey}'!`,
    code: 'INVALID_ID_ERROR'
  }
}

export const NOT_FOUND_ERROR = (id: string, operation: string): StateError => {
  return {
    message: `Item with id '${id}' not found to ${operation}!`,
    code: 'NOT_FOUND_ERROR'
  }
}

export const INVALID_ID_VALUE = (id: string, operation: string): StateError => {
  return {
    message: `Invalid ID value for '${id}' in item to ${operation}!`,
    code: 'INVALID_ID_VALUE'
  }
}

export const DOCUMENT_NOT_FOUND_ERROR = (
  model: string,
  field: string,
  value: string
): StateError => {
  return {
    message: `${model} with ${field} '${value}' not found!`,
    code: 'INVALID_ID_VALUE'
  }
}
