const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const departmentController = require('../controllers/departmentController');

// Validation middleware
const validateDepartment = [
  body('name').notEmpty().withMessage('Department name is required'),
  body('code').notEmpty().withMessage('Department code is required')
];

// Routes
router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getById);
router.post('/', validateDepartment, departmentController.create);
router.put('/:id', validateDepartment, departmentController.update);
router.delete('/:id', departmentController.delete);

// Additional routes
router.get('/:id/students', departmentController.getStudents);
router.get('/:id/courses', departmentController.getCourses);
router.get('/:id/instructors', departmentController.getInstructors);

module.exports = router; 