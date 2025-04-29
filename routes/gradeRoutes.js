const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Create a new grade
router.post('/', gradeController.create);

// Get all grades
router.get('/', gradeController.getAll);

// Get grades by enrollment
router.get('/enrollment/:enrollmentId', gradeController.getByEnrollment);

// Get grades by student (using query parameter)
router.get('/student', gradeController.getByStudent);

// Get grade by ID
router.get('/:id', gradeController.getById);

// Update grade
router.put('/:id', gradeController.update);

// Delete grade
router.delete('/:id', gradeController.delete);

module.exports = router; 