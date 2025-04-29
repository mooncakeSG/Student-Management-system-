const { Course, Department, Instructor, Enrollment, Student, Grade } = require('../models');
const { validationResult } = require('express-validator');

// Get all courses with related data
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { association: 'department' },
        { association: 'instructor' }
      ]
    });
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// Get course by ID with related data
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { association: 'department' },
        { association: 'instructor' }
      ]
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, code, credits, department_id, instructor_id } = req.body;
    
    // Check if course with same code exists
    const existingCourse = await Course.findOne({
      where: { code }
    });

    if (existingCourse) {
      return res.status(400).json({ error: 'Course with this code already exists' });
    }

    // Check if department exists
    const department = await Department.findByPk(department_id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Check if instructor exists
    const instructor = await Instructor.findByPk(instructor_id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    const course = await Course.create({
      name,
      code,
      credits,
      department_id,
      instructor_id
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, code, credits, department_id, instructor_id } = req.body;
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if code is being changed and if it's already in use
    if (code && code !== course.code) {
      const existingCourse = await Course.findOne({
        where: { code }
      });

      if (existingCourse) {
        return res.status(400).json({ error: 'Course code already in use' });
      }
    }

    // Check if department exists if department_id is provided
    if (department_id) {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
    }

    // Check if instructor exists if instructor_id is provided
    if (instructor_id) {
      const instructor = await Instructor.findByPk(instructor_id);
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }
    }

    await course.update({
      name,
      code,
      credits,
      department_id,
      instructor_id
    });

    // Get updated course with related info
    const updatedCourse = await Course.findByPk(req.params.id, {
      include: [
        {
          model: Department,
          attributes: ['id', 'name', 'code']
        },
        {
          model: Instructor,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.destroy();
    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// Get course enrollments
exports.getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollments = await Enrollment.findAll({
      where: { course_id: req.params.id },
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course enrollments',
      error: error.message
    });
  }
};

// Get course grades
exports.getCourseGrades = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const grades = await Grade.findAll({
      include: [
        {
          model: Enrollment,
          where: { course_id: req.params.id },
          include: [
            {
              model: Student,
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course grades',
      error: error.message
    });
  }
}; 