const knex = require('../../../config/knex')
const queryBase = require('./queryBase')

module.exports = function count(table, where, count = null) {
  const query = queryBase(table, where)
  if (count) {
    return query
      .count({ count: knex.raw(count) })
      .then((result) => result[0].count)
  }
  return query.count(`${table}.id as count`).then((result) => result[0].count)
}
