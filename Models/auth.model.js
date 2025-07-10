"use strict";
var dbConn = require("../config/db.config");
const bcrypt = require("bcrypt");

var Auth = function (auth) {
  this.employeeId = auth.employeeId;
  this.username = auth.username;
  this.password = auth.password; // This will be hashed before insertion
  this.loginTime = auth.loginTime || null;
  this.logoutTime = auth.logoutTime || null;
};

// ✅ Create Auth Entry
Auth.create = async function (auth, result) {
  try {
    const hashedPassword = await bcrypt.hash(auth.password, 10);

    dbConn.query(
      `INSERT INTO employee_auth (employeeId, username, password, loginTime, logoutTime)
       VALUES (?, ?, ?, ?, ?)`,
      [auth.employeeId, auth.username, hashedPassword, auth.loginTime, auth.logoutTime],
      function (err, res) {
        if (err) {
          console.log("❌ Error in INSERT auth:", err);
          result(err, null);
        } else {
          console.log("✅ Auth entry created");
          result(null, res);
        }
      }
    );
  } catch (err) {
    console.error("❌ Bcrypt error:", err);
    result(err, null);
  }
};

// ✅ Get All Auth Entries
Auth.getAll = function (result) {
  dbConn.query("SELECT * FROM employee_auth", function (err, res) {
    if (err) {
      console.log("❌ Error in GET ALL auth:", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// ✅ Get Auth by Username
Auth.findByUsername = function (username) {
  return new Promise((resolve, reject) => {
    dbConn.query(
      "SELECT * FROM employee_auth WHERE username = ?",
      [username],
      function (err, res) {
        if (err) {
          console.log("❌ Error in GET BY USERNAME:", err);
          reject(err);
        } else {
          resolve(res[0]); // First user (or undefined)
        }
      }
    );
  });
};

// ✅ Update Auth by ID
Auth.updateById = async function (id, auth, result) {
  try {
    const hashedPassword = await bcrypt.hash(auth.password, 10);

    dbConn.query(
      `UPDATE employee_auth SET employeeId = ?, username = ?, password = ?, loginTime = ?, logoutTime = ?
       WHERE id = ?`,
      [auth.employeeId, auth.username, hashedPassword, auth.loginTime, auth.logoutTime, id],
      function (err, res) {
        if (err) {
          console.log("❌ Error in UPDATE auth:", err);
          result(err, null);
        } else {
          result(null, res);
        }
      }
    );
  } catch (err) {
    console.error("❌ Bcrypt error:", err);
    result(err, null);
  }
};

// ✅ Delete Auth by ID
Auth.deleteByEmployeeId = function (employeeId, result) {
  dbConn.query(
    "DELETE FROM employee_auth WHERE employeeId = ?",
    [employeeId],
    function (err, res) {
      if (err) {
        console.log("❌ Error in DELETE auth by employeeId:", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};


module.exports = Auth;
