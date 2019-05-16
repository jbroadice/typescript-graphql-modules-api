require('dotenv').config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
} = process.env;

const defaults = {
  client: 'mysql',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
  },
};

const config = {
  development: {
    ...defaults,
    debug: true,
    useNullAsDefault: true,
  },

  production: {
    ...defaults,
    debug: false,
    useNullAsDefault: true,
  },
};

module.exports = config;
export default config;
