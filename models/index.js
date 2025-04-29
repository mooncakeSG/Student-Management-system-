const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Student = require('./Student')(sequelize, Sequelize);
db.Course = require('./Course')(sequelize, Sequelize);
db.Department = require('./Department')(sequelize, Sequelize);
db.Instructor = require('./Instructor')(sequelize, Sequelize);
db.Enrollment = require('./Enrollment')(sequelize, Sequelize);
db.Grade = require('./Grade')(sequelize, Sequelize);

// Define associations
db.Student.belongsTo(db.Department);
db.Department.hasMany(db.Student);

db.Course.belongsTo(db.Department);
db.Department.hasMany(db.Course);

db.Course.belongsTo(db.Instructor);
db.Instructor.hasMany(db.Course);

db.Enrollment.belongsTo(db.Student);
db.Student.hasMany(db.Enrollment);

db.Enrollment.belongsTo(db.Course);
db.Course.hasMany(db.Enrollment);

db.Grade.belongsTo(db.Enrollment);
db.Enrollment.hasOne(db.Grade);

module.exports = db; 