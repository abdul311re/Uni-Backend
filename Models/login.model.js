"use strict";
const dbConn = require("../config/db.config");
const bcrypt = require("bcrypt");
const util = require("util");
const query = util.promisify(dbConn.query).bind(dbConn);

const Auth = function (auth) {
  this.employeeId = auth.employeeId;
  this.username = auth.username;
  this.password = auth.password;
  this.loginTime = auth.loginTime || null;
  this.logoutTime = auth.logoutTime || null;
};

Auth.create = async function (auth) {
  const hashedPassword = await bcrypt.hash(auth.password, 10);
  const sql = `INSERT INTO employee_auth (employeeId, username, password, loginTime, logoutTime)
               VALUES (?, ?, ?, ?, ?)`;
  const values = [auth.employeeId, auth.username, hashedPassword, auth.loginTime, auth.logoutTime];
  const result = await query(sql, values);
  return { id: result.insertId, ...auth };
};

Auth.findByUsername = async function (username) {
  const rows = await query("SELECT * FROM employee_auth WHERE username = ?", [username]);
  return rows[0];
};

module.exports = Auth;
