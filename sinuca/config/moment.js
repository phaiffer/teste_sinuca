const moment = require('moment-timezone')
require('moment/locale/pt-br')

module.exports = moment.tz.setDefault('America/Sao_Paulo')
