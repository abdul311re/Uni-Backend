const express = require("express");
const router = express.Router();
const { updateOnlineStatus } = require("../Controllers/attendence.controller");

router.get("/update-status", updateOnlineStatus); // http://localhost:5000/api/attendance/update-status

module.exports = router;
