const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Create a new enrollment
router.post('/', enrollmentController.create);

// Get all enrollments
router.get('/', enrollmentController.getAll);

// Get enrollment by ID
router.get('/:id', enrollmentController.getById);

// Update enrollment
router.put('/:id', enrollmentController.update);

// Delete enrollment
router.delete('/:id', enrollmentController.delete);

// Get enrollments by student
router.get('/student/:studentId', enrollmentController.getByStudent);

// Get enrollments by course
router.get('/course/:courseId', enrollmentController.getByCourse);

module.exports = router; 