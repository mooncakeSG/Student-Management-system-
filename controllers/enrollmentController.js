const Enrollment = require('../models/enrollment');
const Student = require('../models/student');
const Course = require('../models/course');
const Grade = require('../models/grade');

const enrollmentController = {
  // Create a new enrollment
  async create(req, res) {
    try {
      const { student_id, course_id, semester } = req.body;

      // Check if student exists
      const student = await Student.findByPk(student_id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Check if course exists
      const course = await Course.findByPk(course_id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Check if enrollment already exists
      const existingEnrollment = await Enrollment.findOne({
        where: {
          student_id,
          course_id,
          semester
        }
      });

      if (existingEnrollment) {
        return res.status(400).json({ error: 'Student is already enrolled in this course for this semester' });
      }

      const enrollment = await Enrollment.create({
        student_id,
        course_id,
        semester,
        enrollment_date: new Date()
      });

      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all enrollments
  async getAll(req, res) {
    try {
      const enrollments = await Enrollment.findAll({
        include: [
          { model: Student },
          { model: Course }
        ]
      });
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get enrollment by ID
  async getById(req, res) {
    try {
      const enrollment = await Enrollment.findByPk(req.params.id, {
        include: [
          { model: Student },
          { model: Course }
        ]
      });

      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update enrollment
  async update(req, res) {
    try {
      const { status } = req.body;
      const enrollment = await Enrollment.findByPk(req.params.id);

      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      await enrollment.update({ status });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete enrollment
  async delete(req, res) {
    try {
      const enrollment = await Enrollment.findByPk(req.params.id);

      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      await enrollment.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get enrollments by student
  async getByStudent(req, res) {
    try {
      const enrollments = await Enrollment.findAll({
        where: { student_id: req.params.studentId },
        include: [
          { model: Course },
          { model: Grade }
        ]
      });
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get enrollments by course
  async getByCourse(req, res) {
    try {
      const enrollments = await Enrollment.findAll({
        where: { course_id: req.params.courseId },
        include: [
          { model: Student },
          { model: Grade }
        ]
      });
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = enrollmentController; 