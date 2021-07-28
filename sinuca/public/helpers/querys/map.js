module.exports = function map(callback) {
  return (records) => records.map(callback)
}
