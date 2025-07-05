const db = require("../config/db.config");

const Auth = {
  findByUsername: (username, callback) => {
    db.query("SELECT * FROM employee_auth WHERE username = ?", [username], (err, results) => {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    });
  }
};

module.exports = Auth;
