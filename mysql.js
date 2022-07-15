require("dotenv").config();
const mysql = require('mysql');

var pool = mysql.createPool({
  "user": process.env.MYSQL_USER,
  "password": process.env.MYSQL_PASSWORD,
  "database": MYSQL_DATABASE,
  "host": MYSQL_HOST,
  "port": 3306
});

exports.pool = pool;