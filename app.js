const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const db = require('./models');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindow * 60 * 1000, // 15 minutes
  max: config.security.rateLimitMax // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors(config.cors));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging setup
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, config.logging.file),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// HTML Pages
app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'courses.html'));
});

app.get('/departments', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'departments.html'));
});

app.get('/add-course', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-course.html'));
});

app.get('/add-department', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-department.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
try {
  app.use('/api/departments', require('./routes/departmentRoutes'));
  app.use('/api/instructors', require('./routes/instructorRoutes'));
  app.use('/api/courses', require('./routes/courseRoutes'));
  app.use('/api/students', require('./routes/studentRoutes'));
  app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
  app.use('/api/grades', require('./routes/gradeRoutes'));
} catch (error) {
  console.error('Error loading routes:', error);
  process.exit(1);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: 'Something went wrong!',
    error: config.server.env === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync database models (without altering existing tables)
    await db.sequelize.sync({ force: false, alter: false });
    console.log('Database models synchronized successfully.');

    // Start server on port 3000
    const server = app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed. Exiting...');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;