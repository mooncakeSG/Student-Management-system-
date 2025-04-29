const { Sequelize } = require('sequelize');

// Create a new Sequelize instance with the correct database
const sequelize = new Sequelize('student_management_system', 'root', 'newpassword123', {
  host: 'localhost',
  dialect: 'mysql'
});

async function syncDatabase() {
  try {
    console.log('Starting database synchronization...');
    console.log('Database connection URI:', sequelize.config.database);
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Import models
    const Student = require('./models/Student')(sequelize, Sequelize);
    const Course = require('./models/Course')(sequelize, Sequelize);
    const Department = require('./models/Department')(sequelize, Sequelize);
    const Instructor = require('./models/Instructor')(sequelize, Sequelize);
    const Enrollment = require('./models/Enrollment')(sequelize, Sequelize);
    const Grade = require('./models/Grade')(sequelize, Sequelize);

    // Define associations
    Student.belongsTo(Department);
    Department.hasMany(Student);

    Course.belongsTo(Department);
    Department.hasMany(Course);

    Course.belongsTo(Instructor);
    Instructor.hasMany(Course);

    Enrollment.belongsTo(Student);
    Student.hasMany(Enrollment);

    Enrollment.belongsTo(Course);
    Course.hasMany(Enrollment);

    Grade.belongsTo(Enrollment);
    Enrollment.hasOne(Grade);
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
    
    // List all models
    const models = Object.keys(sequelize.models);
    console.log('Synchronized models:', models);
    
    process.exit(0);
  } catch (error) {
    console.error('Error details:', error);
    process.exit(1);
  }
}

syncDatabase(); 