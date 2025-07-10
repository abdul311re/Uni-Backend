const dbConn = require("../config/db.config");

// Constructor
const Project = function (project) {
  this.projectName = project.projectName;
  this.clientName = project.clientName;
  this.clientEmail = project.clientEmail;
  this.clientPhone = project.clientPhone;
  this.city = project.city;
  this.budget = project.budget;
  this.startDate = project.startDate;
  this.dueDate = project.dueDate;
  this.description = project.description;
  this.projectType = project.projectType;
};

// ✅ CREATE a new project
Project.createProject = (projectData, result) => {
  dbConn.query(
    `INSERT INTO projects 
    (project_name, client_name, client_email, client_phone, city, budget, start_date, due_date, description, project_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      projectData.projectName,
      projectData.clientName,
      projectData.clientEmail,
      projectData.clientPhone,
      projectData.city,
      projectData.budget,
      projectData.startDate,
      projectData.dueDate,
      projectData.description,
      projectData.projectType,
    ],
    (err, res) => {
      if (err) {
        console.log("❌ Error creating project:", err);
        result(err, null);
      } else {
        console.log("✅ Project created:", res.insertId);
        result(null, res.insertId);
      }
    }
  );
};

// ✅ ASSIGN employees to a project
const assignEmployeesToProject = async (projectId, employees) => {
  try {
    for (const emp of employees) {
      await dbConn.promise().query(
        `INSERT INTO project_employees (project_id, employeeId, role) VALUES (?, ?, ?)`,
        [projectId, emp.employeeId, emp.role]
      );
    }
    console.log("✅ Employees assigned to project.");
  } catch (err) {
    console.error("❌ Error assigning employees:", err);
    throw err;
  }
};

// ✅ GET all projects
Project.getAll = (result) => {
  dbConn.query("SELECT * FROM projects", (err, res) => {
    if (err) {
      console.log("❌ Error fetching projects:", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// ✅ GET single project by ID
Project.getById = (projectId, result) => {
  dbConn.query("SELECT * FROM projects WHERE id = ?", [projectId], (err, res) => {
    if (err) {
      console.log("❌ Error fetching project:", err);
      result(err, null);
    } else if (res.length === 0) {
      result({ kind: "not_found" }, null);
    } else {
      result(null, res[0]);
    }
  });
};

// ✅ UPDATE project by ID
Project.updateById = (id, projectData, result) => {
  dbConn.query(
    `UPDATE projects SET 
      project_name = ?, client_name = ?, client_email = ?, client_phone = ?, 
      city = ?, budget = ?, start_date = ?, due_date = ?, description = ?, project_type = ?
     WHERE id = ?`,
    [
      projectData.projectName,
      projectData.clientName,
      projectData.clientEmail,
      projectData.clientPhone,
      projectData.city,
      projectData.budget,
      projectData.startDate,
      projectData.dueDate,
      projectData.description,
      projectData.projectType,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("❌ Error updating project:", err);
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// ✅ DELETE project by ID
Project.deleteById = (id, result) => {
  dbConn.query("DELETE FROM projects WHERE id = ?", [id], (err, res) => {
    if (err) {
      console.log("❌ Error deleting project:", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = {
  Project,
  assignEmployeesToProject,
};
