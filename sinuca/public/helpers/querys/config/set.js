const update = require('../update')
const create = require('../create')
const get = require('./get')

module.exports = async function set(key, value) {
  const oldConfig = await get(key)
  if (oldConfig) {
    return await update(
      'configs',
      { key },
      { value: JSON.stringify(value) },
      false,
    ).then((config) => JSON.parse(config.value))
  }

  return await create('configs', {
    key,
    value: JSON.stringify(value),
  }).then((config) => JSON.parse(config.value))
}
