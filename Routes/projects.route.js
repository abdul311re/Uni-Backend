const express = require("express");
const router = express.Router();
const projectController = require("../Controllers/projects.controller");

// Status + ID (with team)
router.get("/:status/:id/team", projectController.getstatusProjectByIdWithTeam);


router.post("/", projectController.create);
router.get("/", projectController.findAll);
router.get("/pending", projectController.getPending);
router.get("/completed", projectController.getCompleted);
router.get("/stopped", projectController.getStopped);
router.get("/:id", projectController.findById);
router.put("/:id", projectController.updateById);
router.delete("/:id", projectController.delete);


module.exports = router;
