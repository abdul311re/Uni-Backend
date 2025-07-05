'use strict'
var dbConn = require("../config/db.config")
const nodemailer = require("nodemailer");
var MAIL = require("../config/mail.config");

var Employee =  function (employee){
    this.fullName = employee.fullName;
    this.email = employee.email;
    this.employeeId = employee.employeeId;
    this.phone = employee.phone;
    this.bankAccount = employee.bankAccount;
    this.gender = employee.gender;
    this.nationality = employee.nationality;
    this.jobTitle = employee.jobTitle;
    this.city = employee.city;
    this.workShift = employee.workShift;
    this.salary = employee.salary;
    this.degree = employee.degree;
    this.experience = employee.experience;
    this.date = employee.date;
    this.address = employee.address;
    this.employmentType = employee.employmentType;
    this.resume = employee.resume;
    this.macaddress = employee.macaddress;
    this.image = employee.image;
};
Employee.create = function(employee ,result){
    dbConn.query(`INSERT INTO employees (fullName, email, employeeId, phone, bankAccount, gender, nationality, jobTitle, city, workShift, salary, degree, experience, date, address, employmentType, resume, macaddress, image)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[employee.fullName , employee.email, employee.employeeId , employee.phone, employee.bankAccount, employee.gender, employee.nationality, employee.jobTitle, employee.city, employee.workShift, employee.salary, employee.degree, employee.experience, employee.date , employee.address, employee.employmentType, employee.resume ,employee.macaddress, employee.image],function(err , res)
    { 
     if (err){
        console.log ("error", err);
        result (err ,null);
     }
     else{
            console.log("Employee created");
            result(null, res);
     }
    })
}
Employee.getAll = function (result) {
    dbConn.query("SELECT * FROM employees", function (err, res) {
      if (err) {
        console.log("❌ Error in GET ALL:", err);
        result(err, null);
      } else {
        result(null, res);
      }
    });
  };
// ✅ UPDATE BY ID
Employee.updateById = function (id, employee, result) {
    dbConn.query(
      `UPDATE employees SET fullName = ?, email = ?, employeeId = ?, phone = ?, bankAccount = ?, gender = ?, nationality = ?, jobTitle = ?, city = ?, workShift = ?, salary = ?, degree = ?, experience = ?, date = ?, address = ?, employmentType = ?, resume = ?,macaddress=? , image = ?, WHERE id = ?`,
      [
        employee.fullName, employee.email, employee.employeeId, employee.phone,
        employee.bankAccount, employee.gender, employee.nationality, employee.jobTitle,
        employee.city, employee.workShift, employee.salary, employee.degree,
        employee.experience, employee.date, employee.address, employee.employmentType,
        employee.resume,employee.macaddress,employee.image, id
      ],
      function (err, res) {
        if (err) {
          console.log("❌ Error in UPDATE:", err);
          result(err, null);
        } else {
          result(null, res);
        }
      }
    );
  };
  
  // ✅ DELETE BY ID
  Employee.deleteById = function (id, result) {
    dbConn.query("DELETE FROM employees WHERE id = ?", [id], function (err, res) {
      if (err) {
        console.log("❌ Error in DELETE:", err);
        result(err, null);
      } else {
        result(null, res);
      }
    });
  };
  
  Employee.getById = function(id, result) {
    dbConn.query("SELECT * FROM employees WHERE id = ?", [id], function(err, res) {
        if (err) {
            console.log("❌ Error finding employee by id:", err);
            result(err, null);
        } else {
            result(null, res[0]); // return one record
        }
    });
};
module.exports = Employee;