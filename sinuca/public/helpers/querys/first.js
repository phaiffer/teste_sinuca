const queryBase = require('./queryBase')
const parseFields = require('./parseFields')
const knex = require('../../../config/knex')

module.exports = function first(table, where, select = '*', castsFields = {}) {
  const query = queryBase(table, where)

  if (typeof select === 'string') {
    return query.first(`${table}.${select}`).then(parseFields(castsFields))
  }
  if (typeof select === 'function') {
    return query.first(...select(knex.raw)).then(parseFields(castsFields))
  }
  return query.first(...select).then(parseFields(castsFields))
}
