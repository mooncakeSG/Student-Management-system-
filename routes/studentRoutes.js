const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');

// Validation middleware
const validateStudent = [
  body('student_id').notEmpty().withMessage('Student ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('department_id').isInt().withMessage('Valid department ID is required'),
  body('batch').notEmpty().withMessage('Batch is required')
];

// Routes
router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.post('/', validateStudent, studentController.create);
router.put('/:id', validateStudent, studentController.update);
router.delete('/:id', studentController.delete);
router.get('/:id/enrollments', studentController.getEnrollments);
router.get('/:id/grades', studentController.getGrades);

module.exports = router; 