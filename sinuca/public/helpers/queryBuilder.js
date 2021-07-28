const knexfile = require('../../knexfile')
const knex = require('knex')

const parseFields = require('./querys/parseFields')
const map = require('./querys/map')

class QueryBuilder {
  constructor(db = 'development') {
    this.knex = knex(knexfile[db])
  }

  queryBase(table, where) {
    const query = this.knex(table)
    if (typeof where === 'function') {
      where(query)
    } else if (typeof where === 'object' && Object.keys(where).length > 0) {
      query.where(where)
    } else if (where) {
      query.where({ id: where })
    }
    return query
  }

  count(table, where) {
    const query = this.queryBase(table, where)
    return query.count(`${table}.id as count`).then((result) => result[0].count)
  }

  async create(table, data) {
    const recordId = await this.knex(table).insert(data)
    return await this.find(table, recordId)
  }

  find(table, id) {
    return this.first(table, { id })
  }

  first(table, where, select = '*', castsFields = {}) {
    const query = this.queryBase(table, where)

    if (typeof select === 'string') {
      return query.first(`${table}.${select}`).then(parseFields(castsFields))
    }
    if (typeof select === 'function') {
      return query.first(...select(this.knex.raw)).then(parseFields(castsFields))
    }
    return query.first(...select).then(parseFields(castsFields))
  }

  get(table, where, select = '*', castsFields = {}) {
    const query = this.queryBase(table, where)
    if (typeof select === 'string') {
      return query
        .select(`${table}.${select}`)
        .then(map(parseFields(castsFields)))
    }
    if (typeof select === 'function') {
      return query
        .select(...select(this.knex.raw))
        .then(map(parseFields(castsFields)))
    }
    return query.select(...select).then(map(parseFields(castsFields)))
  }

  async paginate(table, perPage, page, where, select = '*') {
    return {
      records: await this.get(table, (query) => {
        if (typeof where === 'function') {
          where(query)
        } else if (typeof where === 'object' && Object.keys(where).length > 0) {
          query.where(where)
        } else if (where) {
          query.where({ id: where })
        }
        query.limit(perPage)
        query.offset(page * perPage)
      }, select),
      total_records: await this.count(table, where),
    }
  }

  async update(table, where, data, updated_at = true) {
    await this.queryBase(table, where).update({
      ...data,
      ...(updated_at
        ? {
            updated_at: this.knex.fn.now(),
          }
        : {}),
    })
    return await this.first(table, where)
  }

  async del(table, where) {
    return await this.queryBase(table, where).del();
  }
}

function getQueryBuilder(db = 'development') {
  return new QueryBuilder(db)
}

module.exports = getQueryBuilder
