require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'voicepoc',
  },
  migrations: {
    directory: require('path').resolve(__dirname, '../migrations'),
  },
  seeds: {
    directory: require('path').resolve(__dirname, '../seeds'),
  },
};
