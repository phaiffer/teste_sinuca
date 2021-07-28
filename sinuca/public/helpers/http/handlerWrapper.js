const qs = require('qs')

const { Response } = require('./Response')
const ApiError = require('./errors/ApiError')
const ValidationRequest = require('./errors/ValidationRequest')
const getParams = require('../getParams')

const Job = require('../jobs/Job')

const formatErrorResponse = (error, statusCode = 500) => {
  if (error instanceof ApiError) {
    return Response.build(
      {
        statusCode: error.statusCode,
        message: error.message,
        ...(Object.keys(error.errors).length > 0
          ? { errors: error.errors }
          : {}),
      },
      error.statusCode,
    )
  }
  return Response.build(
    {
      statusCode,
      message: error.message,
    },
    statusCode,
  )
}

const parseBody = (event) => {
  const contentType = event.headers['content-type']
  if (contentType) {
    const [contentTypeMediaType] = contentType.split(';')
    if (contentTypeMediaType) {
      switch (contentTypeMediaType.toLowerCase()) {
        case 'application/json':
          return JSON.parse(event.body)
        case 'application/x-www-form-urlencoded':
          return qs.parse(event.body)
      }
    }
  }
  return null
}

const buildRequest = (event) => ({
  pathParameters: event.pathParameters,
  headers: event.headers,
  body: parseBody(event),
  queryString: event.queryStringParameters || {},
  data: {},
  currentUser:
    event.requestContext.authorizer && event.requestContext.authorizer.user
      ? JSON.parse(event.requestContext.authorizer.user)
      : null,
  currentApplication:
    event.requestContext.authorizer &&
    event.requestContext.authorizer.application
      ? JSON.parse(event.requestContext.authorizer.application)
      : null,
})

const getParamshandlerWrapper = (
  validRequestConfigOrHandler,
  handlerOrNull = null,
) => {
  if (handlerOrNull === null) {
    return [{}, validRequestConfigOrHandler]
  }
  return [validRequestConfigOrHandler, handlerOrNull]
}

const handlerWrapper = (validRequestConfigOrHandler, handlerOrNull = null) => {
  const [validRequestConfig, handler] = getParamshandlerWrapper(
    validRequestConfigOrHandler,
    handlerOrNull,
  )

  return async (event) => {
    try {
      const headers = {}
      for (const key in event.headers) {
        headers[key.toLowerCase()] = event.headers[key]
      }
      event.headers = headers
      const request = buildRequest(event)

      if (Object.keys(validRequestConfig).length > 0) {
        const validator = new ValidationRequest(
          request.pathParameters,
          request.queryString,
          request.body,
          validRequestConfig,
        )
        request.data = await validator.valid(request)
      }

      const args = getParams(handler).map((paramName) => {
        if (paramName === 'event') {
          return event
        }
        if (paramName === 'request') {
          return request
        }
        if (paramName === 'headers') {
          return request.headers
        }
        if (paramName === 'data') {
          return request.data
        }
        if (paramName === 'currentUser') {
          return request.currentUser
        }
        if (paramName === 'currentApplication') {
          return request.currentApplication
        }
        if (paramName === 'queryString') {
          return request.queryString
        }
        if (paramName === 'job') {
          return Job.create
        }
        if (request.pathParameters[paramName]) {
          return request.pathParameters[paramName]
        }
      })

      return Response.build(await handler(...args))
    } catch (error) {
      return formatErrorResponse(error)
    }
  }
}

module.exports = handlerWrapper
