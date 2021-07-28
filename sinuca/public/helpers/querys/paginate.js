const get = require('./get')
const count = require('./count')

module.exports = async function paginate(table, perPage, page, where, select = '*') {
  return {
    records: await get(table, (query) => {
      if (typeof where === 'function') {
        where(query)
      } else if (typeof where === 'object' && Object.keys(where).length > 0) {
        query.where(where)
      } else if (where) {
        query.where({ id: where })
      }
      query.limit(perPage)
      query.offset(page * perPage)
    }, select),
    total_records: await count(table, where),
  }
}
