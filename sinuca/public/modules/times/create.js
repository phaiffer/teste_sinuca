const handlerWrapper = require('../../helpers/http/handlerWrapper');
const validations = require('../../helpers/http/validations');
const create = require('../../helpers/querys/create');

const validRequest = {
    nome: validations.isString(),
    player1: validations.isString(),
    player2: validations.isString(),
}

const handler = handlerWrapper(
    validRequest,
    async (data) => {
      return await create('times', {
          ...data,
          score = 0
      })
    },
  )

  module.exports = {
    handler,
  }
  