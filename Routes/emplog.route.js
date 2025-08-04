const express = require("express");
const router = express.Router();
const  loginEmployee  = require("../Controllers/emplog.controller");

router.post("/", loginEmployee.login);
router.get("/test", (req, res) => {
    res.send("Login route working");
  });
module.exports = router;
