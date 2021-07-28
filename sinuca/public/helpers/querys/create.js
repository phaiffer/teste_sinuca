const knex = require('../../../config/knex')
const find = require('./find')

module.exports = async function create(table, data) {
  if(Array.isArray(data)) {
    await knex(table).insert(data)
    return true;
  }
  const recordId = await knex(table).insert(data)
  return await find(table, recordId)
}
