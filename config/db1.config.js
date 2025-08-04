'use strict';
const mysql = require('mysql2/promise'); // ✅ Use promise wrapper

// Create promise-based connection pool
const dbConn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hrm_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: check connection on startup
(async () => {
  try {
    const connection = await dbConn.getConnection();
    console.log("✅ Database Connected!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = dbConn;
