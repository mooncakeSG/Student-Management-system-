const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const courseController = require('../controllers/courseController');

// Validation middleware
const validateCourse = [
  body('code').notEmpty().withMessage('Course code is required'),
  body('name').notEmpty().withMessage('Course name is required'),
  body('credits').isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6'),
  body('department_id').isInt().withMessage('Valid department ID is required'),
  body('instructor_id').isInt().withMessage('Valid instructor ID is required')
];

// Routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', validateCourse, courseController.createCourse);
router.put('/:id', validateCourse, courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/:id/enrollments', courseController.getCourseEnrollments);
router.get('/:id/grades', courseController.getCourseGrades);

module.exports = router; 