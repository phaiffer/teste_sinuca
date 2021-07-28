const first = require('../first')

module.exports = async function get(key) {
  const config = await first('configs', { key })
  if (config) {
    return JSON.parse(config.value)
  }
  return null
}
