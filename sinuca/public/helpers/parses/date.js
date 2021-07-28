function parseDate(date) {
  const dateS = date.split('/')
  return `${dateS[2]}-${dateS[1]}-${dateS[0]}`
}

module.exports = {
  parseDate,
}
