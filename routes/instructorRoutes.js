const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const instructorController = require('../controllers/instructorController');

// Validation middleware
const validateInstructor = [
  body('name').notEmpty().withMessage('Instructor name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('department_id').isInt().withMessage('Valid department ID is required'),
  body('title').notEmpty().withMessage('Title is required')
];

// Routes
router.get('/', instructorController.getAll);
router.get('/:id', instructorController.getById);
router.post('/', validateInstructor, instructorController.create);
router.put('/:id', validateInstructor, instructorController.update);
router.delete('/:id', instructorController.delete);
router.get('/:id/courses', instructorController.getCourses);

module.exports = router; 