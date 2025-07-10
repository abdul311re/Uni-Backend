const { createProject, assignEmployeesToProject } = require("../Models/projects.model");
const db = require("../config/db.config");
const createNewProject = async (req, res) => {
  const {
    projectName,
    clientName,
    clientEmail,
    clientPhone,
    city,
    budget,
    startDate,
    dueDate,
    details,
    projectType,
    assignedEmployees,
  } = req.body;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const projectId = await createProject({
      projectName,
      clientName,
      clientEmail,
      clientPhone,
      city,
      budget,
      startDate,
      dueDate,
      details,
      projectType,
    });

    await assignEmployeesToProject(projectId, assignedEmployees);

    await conn.commit();
    res.json({ success: true, projectId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).send("Error creating project");
  } finally {
    conn.release();
  }
};
module.exports = {createNewProject};