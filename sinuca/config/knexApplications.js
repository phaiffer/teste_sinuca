const knexfile = require('../knexfile')
const knex = require('knex')(knexfile.teste)

module.exports = knex
