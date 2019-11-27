import { StateError } from '../types/statusErrorTypes'

class CustomError extends Error {
  extensions: Record<string, any>

  constructor(stateError: StateError, extensions?: Record<string, any>) {
    super(stateError.message)

    const name = stateError.code
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
      .join('')

    Object.defineProperty(this, 'name', { value: name })

    const code = stateError.code
    this.extensions = {
      code,
      ...extensions
    }
  }
}

export { CustomError }
