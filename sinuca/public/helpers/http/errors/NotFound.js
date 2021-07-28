const ApiError = require('./ApiError')

class NotFound extends ApiError {
  constructor() {
    super('not found', { statusCode: 404 })
  }
}

module.exports = NotFound
