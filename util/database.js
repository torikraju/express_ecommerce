const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'std123',
  database: 'express_ecommerce'
});

module.exports = pool.promise();
