const Project = require("../Models/projects.model");

exports.create = (req, res) => {
  const { employees, ...projectData } = req.body;

  if (!projectData.projectName || !projectData.clientName) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  Project.createProject(projectData, employees, (err, data) => {
    if (err) return res.status(500).json({ message: "Failed to create project", error: err });
    res.status(201).json(data);
  });
};

exports.findAll = (req, res) => {
  Project.findAll((err, data) => {
    if (err) return res.status(500).json({ message: "Error retrieving projects", error: err });
    res.json(data);
  });
};

exports.findById = (req, res) => {
  Project.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") return res.status(404).json({ message: "Project not found" });
      return res.status(500).json({ message: "Error retrieving project", error: err });
    }
    res.json(data);
  });
};

exports.updateById = (req, res) => {
  Project.updateById(req.params.id, req.body, (err, data) => {
    if (err) return res.status(500).json({ message: "Update failed", error: err });
    res.json(data);
  });
};

exports.delete = (req, res) => {
  Project.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") return res.status(404).json({ message: "Project not found" });
      return res.status(500).json({ message: "Error deleting project", error: err });
    }
    res.json({ message: "Project deleted successfully" });
  });
};

exports.getPending = (req, res) => {
  Project.getPendingProjects((err, data) => {
    if (err) return res.status(500).json({ message: "Failed to fetch pending projects", error: err });
    res.json(data);
  });
};

exports.getCompleted = (req, res) => {
  Project.getCompletedProjects((err, data) => {
    if (err) return res.status(500).json({ message: "Failed to fetch completed projects", error: err });
    res.json(data);
  });
};

exports.getStopped = (req, res) => {
  Project.getStoppedProjects((err, data) => {
    if (err) return res.status(500).json({ message: "Failed to fetch stopped projects", error: err });
    res.json(data);
  });
};

exports.getstatusProjectByIdWithTeam = (req, res) => {
  const { id, status } = req.params;

  Project.getProjectByIdAndStatus(id, status, (err, data) => {
    if (err) {
      if (err.kind === "not_found") return res.status(404).json({ message: "Project not found" });
      return res.status(500).json({ message: "Error fetching project by ID & status", error: err });
    }
    res.json(data);
  });
};
