const { Grade, Enrollment, Student, Course } = require('../models');

const gradeController = {
  // Create a new grade
  async create(req, res) {
    try {
      const { enrollment_id, grade, grade_letter, remarks } = req.body;
      
      // Check if enrollment exists
      const enrollment = await Enrollment.findByPk(enrollment_id);
      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      // Check if grade already exists for this enrollment
      const existingGrade = await Grade.findOne({
        where: { enrollment_id }
      });

      if (existingGrade) {
        return res.status(400).json({ error: 'Grade already exists for this enrollment' });
      }

      const newGrade = await Grade.create({
        enrollment_id,
        grade,
        grade_letter,
        remarks
      });

      res.status(201).json(newGrade);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all grades
  async getAll(req, res) {
    try {
      const grades = await Grade.findAll({
        include: [
          {
            model: Enrollment,
            include: [
              { model: Student },
              { model: Course }
            ]
          }
        ]
      });
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get grade by ID
  async getById(req, res) {
    try {
      const grade = await Grade.findByPk(req.params.id, {
        include: [
          {
            model: Enrollment,
            include: [
              { model: Student },
              { model: Course }
            ]
          }
        ]
      });

      if (!grade) {
        return res.status(404).json({ error: 'Grade not found' });
      }

      res.json(grade);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update grade
  async update(req, res) {
    try {
      const { grade, grade_letter, remarks } = req.body;
      const gradeRecord = await Grade.findByPk(req.params.id);

      if (!gradeRecord) {
        return res.status(404).json({ error: 'Grade not found' });
      }

      await gradeRecord.update({
        grade,
        grade_letter,
        remarks
      });

      res.json(gradeRecord);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete grade
  async delete(req, res) {
    try {
      const grade = await Grade.findByPk(req.params.id);

      if (!grade) {
        return res.status(404).json({ error: 'Grade not found' });
      }

      await grade.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get grades by enrollment
  async getByEnrollment(req, res) {
    try {
      const grades = await Grade.findAll({
        where: { enrollment_id: req.params.enrollmentId },
        include: [
          {
            model: Enrollment,
            include: [
              { model: Student },
              { model: Course }
            ]
          }
        ]
      });
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get grades by student
  async getByStudent(req, res) {
    try {
      const enrollments = await Enrollment.findAll({
        where: { student_id: req.params.studentId },
        include: [
          {
            model: Grade,
            required: true
          },
          {
            model: Course
          }
        ]
      });

      const grades = enrollments.map(enrollment => ({
        ...enrollment.Grade.dataValues,
        course: enrollment.Course,
        enrollment: {
          id: enrollment.id,
          semester: enrollment.semester,
          status: enrollment.status
        }
      }));

      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = gradeController; 