const handlerWrapper = require('../../helpers/http/handlerWrapper');
const validations = require('../../helpers/http/validations');
const create = require('../../helpers/querys/create');

const validRequest = {
  timeId: validations.isNumeric(),

}

const handler = handlerWrapper(
  validRequest,
  async (data) => {
    return await create('tabela', {
      times_id: data.timesId,
      score: 0
    })
  },
)

module.exports = {
  handler,
}
