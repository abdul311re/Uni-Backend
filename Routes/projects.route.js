const express = require("express");
const router = express.Router();
const { createNewProject } = require("../Controllers/projects.controller");

router.post("/", createNewProject);

module.exports = router;
