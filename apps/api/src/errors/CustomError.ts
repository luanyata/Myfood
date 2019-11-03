class CustomError extends Error {
  extensions: Record<string, any>

  constructor(message: string, code: string, extensions?: Record<string, any>) {
    super(message)

    const name = code
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
      .join('')

    Object.defineProperty(this, 'name', { value: name })

    this.extensions = {
      code,
      ...extensions
    }
  }
}

export { CustomError }
