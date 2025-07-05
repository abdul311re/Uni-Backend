const Employee = require("../Models/employee.model");
const InsertAuth = require('../Models/auth.model');
const bcrypt = require("bcrypt");

// ✅ CREATE EMPLOYEE + AUTH
exports.create = async function (req, res) {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  const {
    fullName, email, employeeId, phone, bankAccount,
    gender, nationality, jobTitle, city, workShift,
    salary, degree, experience, date, address,
    employmentType, macaddress, 
    username, password
  } = req.body;

  if (!fullName || !email || !employeeId || !username || !password) {
    return res.status(400).send({
      error: true,
      message: "Please provide all required fields",
    });
  }

  const employeeData = {
    fullName,
    email,
    employeeId,
    phone,
    bankAccount,
    gender,
    nationality,
    jobTitle,
    city,
    workShift,
    salary,
    degree,
    experience,
    date,
    address,
    employmentType,
    resume: req.files?.resume ? req.files.resume[0].filename : null,
    macaddress,
    image: req.files?.image ? req.files.image[0].filename : null,
  };

  try {
    Employee.create(employeeData, async function (err, employeeRes) {
      if (err) {
        console.error("❌ Error inserting employee:", err);
        return res.status(500).send({ error: true, message: "Employee creation failed", details: err });
      }
      console.log("\n\n'" + password + "'")
      const hashedPassword = await bcrypt.hash(password, 10);

      const authData = {
        employeeId,
        username,
        password: hashedPassword,
        loginTime: null,
        logoutTime: null,
      };

      InsertAuth.create(authData, function (authErr, authRes) {
        if (authErr) {
          console.error("❌ Error inserting auth:", authErr);
          return res.status(500).send({ error: true, message: "Auth creation failed", details: authErr });
        }

        res.json({
          error: false,
          message: "✅ Employee and login credentials created successfully!",
          employee: employeeRes,
          auth: authRes,
        });
      });
    });
  } catch (error) {
    console.error("❌ Error during employee + auth creation:", error);
    res.status(500).send({ error: true, message: "Internal server error", details: error.message });
  }
};

// ✅ GET ALL EMPLOYEES
exports.getForms = (req, res) => {
  Employee.getAll((err, employees) => {
    if (err) {
      console.error("🔥 Error fetching employees:", err);
      return res.status(500).json({ error: 'Failed to fetch records', details: err });
    }
    res.status(200).json(employees);
  });
};

// ✅ UPDATE EMPLOYEE BY ID
exports.updateForm = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  Employee.updateById(id, updatedData, (err, result) => {
    if (err) {
      console.error("🔥 Error updating employee:", err);
      return res.status(500).json({ error: 'Update failed', details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: '✅ Employee updated successfully', data: updatedData });
  });
};

// ✅ DELETE EMPLOYEE BY ID
// ✅ DELETE EMPLOYEE BY ID and related auth
exports.deleteForm = (req, res) => {
  const id = req.params.id;

  Employee.getById(id, (findErr, employee) => {
    if (findErr) {
      console.error("🔥 Error finding employee:", findErr);
      return res.status(500).json({ error: "Failed to find employee", details: findErr });
    }

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const empCode = employee.employeeId;  // the employeeId string like AilZaryab

    // now delete auth by employeeId
    InsertAuth.deleteByEmployeeId(empCode, (authErr, authRes) => {
      if (authErr) {
        console.error("🔥 Error deleting auth by employeeId:", authErr);
        return res.status(500).json({ error: "Delete auth failed", details: authErr });
      }

      // then delete employee by numeric id
      Employee.deleteById(id, (empErr, empRes) => {
        if (empErr) {
          console.error("🔥 Error deleting employee:", empErr);
          return res.status(500).json({ error: "Delete employee failed", details: empErr });
        }

        if (empRes.affectedRows === 0) {
          return res.status(404).json({ error: "Employee not found" });
        }

        res.json({ message: "✅ Employee and their auth deleted successfully" });
      });
    });
  });
};
