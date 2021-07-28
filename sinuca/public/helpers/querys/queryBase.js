const knex = require('../../../config/knex')

module.exports = function queryBase(table, where) {
  const query = knex(table)
  if (typeof where === 'function') {
    where(query)
  } else if (typeof where === 'object' && Object.keys(where).length > 0) {
    query.where(where)
  } else if (where) {
    query.where({ id: where })
  }
  return query
}
