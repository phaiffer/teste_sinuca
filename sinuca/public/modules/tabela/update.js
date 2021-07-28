const handlerWrapper = require('../../helpers/http/handlerWrapper');
const update = require('../../helpers/querys/update');
const first = require('../../helpers/querys/first');

const handler = handlerWrapper(async (id) => {
  const time = await first('table', {time_id: id})
  if (score === 10) {
    return `parabens time: ${time.name}, ganhou`
  }
  return await update('table', { time_id: id, score: score + 1 })

},
)

module.exports = {
  handler,
}