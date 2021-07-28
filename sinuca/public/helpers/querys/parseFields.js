const parseDatetime = require('./parses/parseDatetime')

const parses = {
  datetime: parseDatetime,
}

module.exports = function parseFields(castsFields) {
  return (record) =>
    Object.keys(parses).reduce(
      (accumulator, parseName) =>
        parses[parseName](accumulator, castsFields[parseName]),
      record,
    )
}
