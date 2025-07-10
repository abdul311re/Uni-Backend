module.exports = function(app) {
    // Import individual route modules
    const employeeRoutes = require('./employee.route');
    const attendenceRoutes = require("./attendence.route");
    const emplogRoutes = require("./emplog.route")
    const projectRoutes = require("./projects.route")

    app.use("/api/v1/auth", emplogRoutes);
    app.use("/api/v1/attendence", attendenceRoutes);    
    // Mount routes with a prefix
    app.use('/api/v1/employees', employeeRoutes);
    app.use('/api/v1/projects', projectRoutes);
    // Health check route
    app.get('/api/v1/health', (req, res) => {
        res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Catch-all 404 handler
    app.use((req, res, next) => {
        res.status(404).json({ error: 'Route not found' });
    });

    // Optional: General error handler
    app.use((err, req, res, next) => {
        console.error('Internal Server Error:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    });
};
