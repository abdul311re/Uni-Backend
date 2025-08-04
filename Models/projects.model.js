"use strict";
const dbConn = require("../config/db.config");

const Project = function (project) {
  this.project_name = project.projectName;
  this.client_name = project.clientName;
  this.client_email = project.clientEmail;
  this.client_phone = project.clientPhone;
  this.city = project.city;
  this.budget = project.budget;
  this.start_date = project.startDate;
  this.due_date = project.dueDate;
  this.description = project.description;
  this.project_type = project.projectType;
  this.status = project.status || "pending";
  this.image_url = project.imageUrl;
};

Project.createProject = (newProjectData, employeeIds = [], result) => {
  const newProject = new Project(newProjectData);

  dbConn.query("INSERT INTO projects SET ?", newProject, (err, res) => {
    if (err) return result(err, null);

    const projectId = res.insertId;

    // Validate and extract IDs
    const values = (employeeIds || [])
      // .filter(emp => typeof emp === "number" || (emp && emp.id))
      // .map(emp => [projectId, typeof emp === "number" ? emp : emp.id]);
      .filter(emp => emp && emp.employeeId)
      .map(emp => [
        projectId,
        emp.employeeId,
        emp.role || null,
        "assigned" // default assignment status
      ]);

    if (values.length > 0) {
      dbConn.query(
        "INSERT INTO project_employees (project_id, employeeId, role, assignment_status) VALUES ?",
        [values],
        (err2) => {
          if (err2) return result(err2, null);
          // result(null, { id: projectId, ...newProjectData, employeeIds: values.map(v => v[1]) });
            result(null, {
            id: projectId,
            ...newProjectData,
            team: values.map(([_, employeeId, role]) => ({
              employeeId,
              role,
              assignmentStatus: "assigned"
            }))
          });
        }
      );
    } else {
      result(null, { id: projectId, ...newProjectData, team: [] });
    }
  });
};

// ✅ Find All Projects (basic)
Project.findAll = (result) => {
  dbConn.query("SELECT * FROM projects ORDER BY updated_at DESC", (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// ✅ Find Project by ID with Team
Project.findById = (id, result) => {
  dbConn.query(
    `SELECT 
      projects.*, 
      project_employees.employeeId, 
      project_employees.role, 
      project_employees.assignment_status,
      employees.fullName AS employeeName,
      employees.email AS employeeEmail
    FROM projects
    LEFT JOIN project_employees ON project_employees.project_id = projects.id
    LEFT JOIN employees ON project_employees.employeeId = employees.id
    WHERE projects.id = ?`,
    [id],
    (err, res) => {
      if (err) return result(err, null);
      if (!res.length) return result({ kind: "not_found" }, null);

      const project = {
        id: res[0].id,
        projectName: res[0].project_name,
        clientName: res[0].client_name,
        clientEmail: res[0].client_email,
        clientPhone: res[0].client_phone,
        city: res[0].city,
        budget: res[0].budget,
        startDate: res[0].start_date,
        dueDate: res[0].due_date,
        description: res[0].description,
        projectType: res[0].project_type,
        status: res[0].status,
        imageUrl: res[0].image_url,
        createdAt: res[0].created_at,
        updatedAt: res[0].updated_at,
        team: []
      };

      res.forEach(row => {
        if (row.employeeId) {
          project.team.push({
            employeeId: row.employeeId,
            role: row.role,
            assignmentStatus: row.assignment_status,
            employeeName: row.employeeName,
            employeeEmail: row.employeeEmail
          });
        }
      });

      result(null, project);
    }
  );
};

// ✅ Update Project
// Project.updateById = (id, project, result) => {
//   dbConn.query(
//     `UPDATE projects SET 
//       project_name = ?, client_name = ?, client_email = ?, client_phone = ?, 
//       city = ?, budget = ?, start_date = ?, due_date = ?, 
//       description = ?, project_type = ?, status = ?, image_url = ?
//     WHERE id = ?`,
//     [
//       project.projectName,
//       project.clientName,
//       project.clientEmail,
//       project.clientPhone,
//       project.city,
//       project.budget,
//       project.startDate,
//       project.dueDate,
//       project.description,
//       project.projectType,
//       project.status,
//       project.imageUrl,
//       id,
//     ],
//     (err) => {
//       if (err) return result(err, null);
//       result(null, { id, ...project });
//     }
//   );
// };
 
Project.updateById = (id, project, result) => {
  dbConn.query(
    `UPDATE projects SET 
      project_name = ?, client_name = ?, client_email = ?, client_phone = ?, 
      city = ?, budget = ?, start_date = ?, due_date = ?, 
      description = ?, project_type = ?, status = ?, image_url = ?
    WHERE id = ?`,
    [
      project.projectName,
      project.clientName,
      project.clientEmail,
      project.clientPhone,
      project.city,
      project.budget,
      project.startDate,
      project.dueDate,
      project.description,
      project.projectType,
      project.status,
      project.imageUrl,
      id,
    ],
    (err, res) => {
      if (err) return result(err, null);

      // ✅ After updating project, update employee assignment status
      let assignmentStatus = null;

      switch (project.status) {
        case "completed":
          assignmentStatus = "completed";
          break;
        case "stopped":
        case "stop": // handle both if used
          assignmentStatus = "transferred"; // or "stopped" if enum allows
          break;
        case "active":
        case "pending":
          assignmentStatus = "assigned";
          break;
        default:
          assignmentStatus = null;
      }

      if (assignmentStatus) {
        dbConn.query(
          `UPDATE project_employees 
           SET assignment_status = ?
           WHERE project_id = ?`,
          [assignmentStatus, id],
          (err2) => {
            if (err2) return result(err2, null);
            result(null, { id, ...project });
          }
        );
      } else {
        result(null, { id, ...project });
      }
    }
  );
};


// ✅ Delete Project
Project.delete = (id, result) => {
  dbConn.query("DELETE FROM projects WHERE id = ?", [id], (err, res) => {
    if (err) return result(err, null);
    if (res.affectedRows === 0) return result({ kind: "not_found" }, null);
    result(null, res);
  });
};

// ✅ Shared helper for status-based project fetch
const getProjectsByStatusWithTeam = (status, result) => {
  dbConn.query(
    `SELECT 
      projects.*, 
      project_employees.employeeId, 
      project_employees.role, 
      project_employees.assignment_status,
      employees.fullName AS employeeName,
      employees.email AS employeeEmail
    FROM projects
    LEFT JOIN project_employees ON project_employees.project_id = projects.id
    LEFT JOIN employees ON project_employees.employeeId = employees.id
    WHERE projects.status = ?
    ORDER BY projects.updated_at DESC`,
    [status],
    (err, res) => {
      if (err) return result(err, null);
      if (!res.length) return result(null, []);

      const projectsMap = {};

      res.forEach(row => {
        if (!projectsMap[row.id]) {
          projectsMap[row.id] = {
            id: row.id,
            projectName: row.project_name,
            clientName: row.client_name,
            clientEmail: row.client_email,
            clientPhone: row.client_phone,
            city: row.city,
            budget: row.budget,
            startDate: row.start_date,
            dueDate: row.due_date,
            description: row.description,
            projectType: row.project_type,
            status: row.status,
            imageUrl: row.image_url,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            team: []
          };
        }

        if (row.employeeId) {
          projectsMap[row.id].team.push({
            employeeId: row.employeeId,
            role: row.role,
            assignmentStatus: row.assignment_status,
            employeeName: row.employeeName,
            employeeEmail: row.employeeEmail
          });
        }
      });

      result(null, Object.values(projectsMap));
    }
  );
};

// Status-specific exports
Project.getPendingProjects = (result) => getProjectsByStatusWithTeam("pending", result);
Project.getCompletedProjects = (result) => getProjectsByStatusWithTeam("completed", result);
Project.getStoppedProjects = (result) => getProjectsByStatusWithTeam("stop", result);

// ✅ Get project by ID and status
Project.getProjectByIdAndStatus = (id, status, result) => {
  dbConn.query(
    `SELECT 
      projects.*, 
      project_employees.employeeId, 
      project_employees.role, 
      project_employees.assignment_status,
      employees.fullName AS employeeName,
      employees.email AS employeeEmail
    FROM projects
    LEFT JOIN project_employees ON project_employees.project_id = projects.id
    LEFT JOIN employees ON project_employees.employeeId = employees.id
    WHERE projects.id = ? AND projects.status = ?`,
    [id, status],
    (err, res) => {
      if (err) return result(err, null);
      if (!res.length) return result({ kind: "not_found" }, null);

      const project = {
        id: res[0].id,
        projectName: res[0].project_name,
        clientName: res[0].client_name,
        clientEmail: res[0].client_email,
        clientPhone: res[0].client_phone,
        city: res[0].city,
        budget: res[0].budget,
        startDate: res[0].start_date,
        dueDate: res[0].due_date,
        description: res[0].description,
        projectType: res[0].project_type,
        status: res[0].status,
        imageUrl: res[0].image_url,
        createdAt: res[0].created_at,
        updatedAt: res[0].updated_at,
        team: []
      };

      res.forEach(row => {
        if (row.employeeId) {
          project.team.push({
            employeeId: row.employeeId,
            role: row.role,
            assignmentStatus: row.assignment_status,
            employeeName: row.employeeName,
            employeeEmail: row.employeeEmail
          });
        }
      });

      result(null, project);
    }
  );
};

module.exports = Project;
