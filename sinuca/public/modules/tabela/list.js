const handlerWrapper = require('../../../helpers/http/handlerWrapper')
const get = require('../../helpers/querys/get')


const handler = handlerWrapper(async (id)=> {
    return get('table', {id})
})

module.exports = {
  handler,
}
