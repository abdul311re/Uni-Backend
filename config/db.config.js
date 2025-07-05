'use strict';
const mysql = require ('mysql2');
//local mysql db connection

const dbConn  = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hrm_system',
  waitForConnections: true,
  connectionLimit: 10, // Maximum connections
  queueLimit: 0,
});

// Check database connection
dbConn.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database Connected!");
    connection.release(); // Release connection back to pool
  }
});

module.exports = dbConn;
