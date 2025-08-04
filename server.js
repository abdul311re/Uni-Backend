const express = require("express");
const cors = require("cors");
const path = require("path")
const bodyParser = require("body-parser");
// Create express app
const app = express();
const corsOptions = {
  origin: [
    "http://localhost:3005",       // React default port
    "http://192.168.10.19:3005",   // React on your IP
    "http://localhost:3001",
    "http://localhost:3002",
    "http://192.168.10.19:3001",
    "http://192.168.100.23:3001",
    "http://192.168.100.23:3005",
    "http://192.168.100.23:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(bodyParser.json());
app.use(cors(corsOptions));~

// Handle preflight requests
app.options("*", cors(corsOptions));

// Setup server port
const port = process.env.PORT || 4500;

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(express.json());

// Make 'uploads' folder publicly accessible
app.use('/uploads1', express.static(path.join(__dirname, 'uploads1')));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Serve static files from the "public" directory
app.use("/public", express.static("public"));

// Define routes
require("./Routes/routes")(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen for requests
app.listen(port, '0.0.0.0',() => {
  console.log(`Server is listening on port ${port}`);
});