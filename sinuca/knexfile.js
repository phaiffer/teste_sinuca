module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: 'root',
      password: 'root',
      database: 'teste',
    },
    migrations: {
      tableName: 'migrations',
    },
  },
}
