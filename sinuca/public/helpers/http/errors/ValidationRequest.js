const qs = require('qs')

const ApiError = require('./ApiError')

class ValidationRequest {
  constructor(pathParameters, queryStringParameters, body, validRequestConfig) {
    this.data = {
      ...pathParameters,
      ...queryStringParameters,
      ...body,
    }
    this.validRequestConfig = validRequestConfig
    this.errors = {}
  }

  addError(field, message) {
    this.errors = {
      ...this.errors,
      [field]: [...(this.errors[field] || []), message],
    }
  }

  setData(field, value) {
    this.data[field] = value
  }

  async valid() {
    if (Object.keys(this.validRequestConfig).length > 0) {
      const promises = []

      Object.keys(this.validRequestConfig).forEach((field) => {
        if (typeof this.validRequestConfig[field] === 'function') {
          if (
            this.validRequestConfig[field].constructor.name === 'AsyncFunction'
          ) {
            promises.push(
              this.validRequestConfig[field](
                this,
                field,
                this.data[field],
                this.data,
              ),
            )
          } else {
            this.validRequestConfig[field](
              this,
              field,
              this.data[field],
              this.data,
            )
          }
        }
      })

      await Promise.all(promises)
    }

    if (Object.keys(this.errors).length > 0) {
      throw new ApiError('Validation Error', {
        errors: this.errors,
      })
    }

    return Object.keys(this.validRequestConfig).reduce(
      (accumulator, field) => ({
        ...accumulator,
        [field]: this.data[field],
      }),
      {},
    )
  }
}

module.exports = ValidationRequest
