module.exports = function filterFields(record, fields_valid) {
  return Object.keys(record).reduce((accumulator, field) => {
    if (fields_valid.includes(field)) {
      return { ...accumulator, [field]: record[field] }
    }
    return accumulator
  }, {})
}
