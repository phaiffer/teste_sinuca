const map = require('./map')
const queryBase = require('./queryBase')
const parseFields = require('./parseFields')
const knex = require('../../../config/knex')

module.exports = function get(table, where, select = '*', castsFields = {}) {
  const query = queryBase(table, where)
  if (typeof select === 'string') {
    return query
      .select(`${table}.${select}`)
      .then(map(parseFields(castsFields)))
  }
  if (typeof select === 'function') {
    return query
      .select(...select(knex.raw))
      .then(map(parseFields(castsFields)))
  }
  return query.select(...select).then(map(parseFields(castsFields)))
}
