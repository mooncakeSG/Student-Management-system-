require('dotenv').config();

module.exports = {
  // Database Configuration
  database: {
    name: process.env.DB_NAME || 'student_management_system',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'newpassword123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15,
    rateLimitMax: process.env.RATE_LIMIT_MAX || 100
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    file: process.env.LOG_FILE || 'logs/app.log'
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || 'your_email@example.com',
    pass: process.env.SMTP_PASS || 'your_email_password'
  }
}; 