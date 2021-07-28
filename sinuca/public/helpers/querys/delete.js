const queryBase = require('./queryBase')

module.exports = async function del(table, where) {
  return await queryBase(table, where).del();
}
