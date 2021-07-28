const validators = require('validator')

function isEmail(message = 'invalid') {
  return (validator, field, value, allData) => {
    if (
      Object.keys(allData).includes(field) &&
      value !== null &&
      value !== ''
    ) {
      if (!validators.isEmail(value)) {
        validator.addError(field, message)
      }
    }
  }
}

function isURL(message = 'invalid') {
  return (validator, field, value, allData) => {
    if (
      Object.keys(allData).includes(field) &&
      value !== null &&
      value !== ''
    ) {
      if (
        !validators.isURL(value, {
          require_protocol: true,
          require_valid_protocol: true,
        })
      ) {
        validator.addError(field, message)
      }
    }
  }
}

function isNumeric(parse = 'int', message = 'invalid') {
  return (validator, field, value, allData) => {
    if (
      Object.keys(allData).includes(field) &&
      value !== null &&
      value !== ''
    ) {
      if (['number', 'string'].includes(typeof value)) {
        if (isNaN(value)) {
          validator.addError(field, message)
        } else {
          if (value === '') {
            validator.setData(field, null)
          } else if (parse === 'float') {
            validator.setData(field, parseFloat(value))
          } else {
            validator.setData(field, parseInt(value))
          }
        }
      } else {
        validator.setData(field, null)
      }
    }
  }
}

function isString(message = 'invalid') {
  return (validator, field, value, allData) => {
    if (
      Object.keys(allData).includes(field) &&
      value !== null &&
      value !== ''
    ) {
      if (!['number', 'string'].includes(typeof value)) {
        validator.addError(field, message)
      } else if (value === '') {
        validator.setData(field, null)
      } else {
        validator.setData(field, `${value}`)
      }
    }
  }
}

function isBoolean(message = 'invalid') {
  return (validator, field, value, allData) => {
    if (
      Object.keys(allData).includes(field) &&
      value !== null &&
      value !== ''
    ) {
      if (['number', 'string', 'boolean'].includes(typeof value)) {
        if (
          !(
            value === '0' ||
            value === '1' ||
            value === 'true' ||
            value === 'false' ||
            value === true ||
            value === false ||
            value === 1 ||
            value === 0
          )
        ) {
          validator.addError(field, message)
        } else {
          if (typeof value === 'string') {
            validator.setData(
              field,
              value.trim() === 'true' || value.trim() === '1',
            )
          } else {
            validator.setData(field, !!value)
          }
        }
      } else {
        validator.setData(field, null)
      }
    }
  }
}

function options(options, message = 'invalid') {
  return (validator, field, value, allData) => {
    if (Object.keys(allData).includes(field)) {
      if (!options.includes(value)) {
        validator.addError(field, message)
      }
    }
  }
}

function required(message = 'blank') {
  return (validator, field, value, allData) => {
    if (
      value === null ||
      value === undefined ||
      validators.isEmpty(`${value}`)
    ) {
      validator.addError(field, message)
    }
  }
}

function size(maxSize, message = 'invalid size') {
  return (validator, field, value, allData) => {
    if (Object.keys(allData).includes(field) && value !== null) {
      if (value.size < maxSize) {
        validator.addError(field, message)
      }
    }
  }
}

function custom(message, handler) {
  if (handler.constructor.name === 'AsyncFunction') {
    return async (validator, field, value, allData) => {
      if (Object.keys(allData).includes(field)) {
        if (!!value && !(await handler(value, allData, validator))) {
          validator.addError(field, message)
        }
      }
    }
  }

  return (validator, field, value) => {
    if (Object.keys(allData).includes(field)) {
      if (!!value && !handler(value, allData)) {
        validator.addError(field, message)
      }
    }
  }
}

function many(validations) {
  const hasAsyncFunction = validations.reduce((accumulator, validation) => {
    if (!accumulator) {
      return validation.constructor.name === 'AsyncFunction'
    }
    return true
  }, false)

  if (hasAsyncFunction) {
    return async (validator, field, value, allData) => {
      const promises = []
      validations.forEach((validation) => {
        if (validation.constructor.name === 'AsyncFunction') {
          promises.push(validation(validator, field, value, allData))
        } else {
          validation(validator, field, value, allData)
        }
      })
      await Promise.all(promises)
    }
  }

  return (validator, field, value, allData) => {
    validations.forEach((validation) => {
      validation(validator, field, value, allData)
    })
  }
}

module.exports = {
  custom,
  isEmail,
  isURL,
  many,
  required,
  size,
  options,
  isNumeric,
  isBoolean,
  isString,
}
