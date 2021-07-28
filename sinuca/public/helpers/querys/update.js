const knex = require('../../../config/knex')
const queryBase = require('./queryBase')
const first = require('./first')

module.exports = async function update(table, where, data, updated_at = true) {
  await queryBase(table, where).update({
    ...data,
    ...(updated_at
      ? {
          updated_at: knex.fn.now(),
        }
      : {}),
  })
  return await first(table, where)
}
