const moment = require('../../../../config/moment')

module.exports = function parseDatetime(record, fields = []) {
  if (record) {
    if (record.created_at) {
      record.created_at = moment(record.created_at).format()
    }
    if (record.updated_at) {
      record.updated_at = moment(record.updated_at).format()
    }

    if (fields && fields.length > 0) {
      fields.forEach((field) => {
        record[field] = moment(record[field]).format()
      })
    }
  }
  return record
}
