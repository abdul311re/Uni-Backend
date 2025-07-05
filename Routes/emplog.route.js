const express = require("express");
const router = express.Router();
const { loginEmployee } = require("../Controllers/emplog.controller");

router.post("/", loginEmployee);

module.exports = router;
