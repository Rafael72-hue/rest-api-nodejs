const mysql = require('mysql');

var pool = mysql.createPool({
  "user": "root",
  "password": "root",
  "database": "ecommerce",
  "host": "localhost",
  "port": 3306
});

exports.pool = pool;