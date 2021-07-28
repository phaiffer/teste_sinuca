const first = require('./first')

module.exports = function find(table, id) {
  return first(table, { id })
}
