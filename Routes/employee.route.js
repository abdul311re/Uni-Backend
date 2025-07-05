// routes/employee.route.js
const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "resume") {
      cb(null, "uploads");
    } else if (file.fieldname === "image") {
      cb(null, "uploads1");
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedDocTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ];

  if (
    (file.fieldname === "resume" && allowedDocTypes.includes(file.mimetype)) ||
    (file.fieldname === "image" && allowedImageTypes.includes(file.mimetype))
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Import controller functions
const {
  create,
  getForms,
  updateForm,
  deleteForm
} = require('../Controllers/employee.controller');

// ✅ Use fields (resume + image)
router.post(
  "/",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  create
);

router.get("/", getForms);

router.put(
  "/:id",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  updateForm
);

router.delete("/:id", deleteForm);

module.exports = router;
