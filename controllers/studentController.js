const { Student, Department, Enrollment, Course, Grade } = require('../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const studentController = {
  // Create a new student
  async create(req, res) {
    try {
      const { name, email, password, department_id } = req.body;
      
      // Check if student with same email exists
      const existingStudent = await Student.findOne({
        where: { email }
      });

      if (existingStudent) {
        return res.status(400).json({ error: 'Student with this email already exists' });
      }

      // Check if department exists
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const student = await Student.create({
        name,
        email,
        password: hashedPassword,
        department_id,
        enrollment_date: new Date()
      });

      // Remove password from response
      const studentResponse = student.toJSON();
      delete studentResponse.password;

      res.status(201).json(studentResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all students
  async getAll(req, res) {
    try {
      const students = await Student.findAll({
        attributes: { exclude: ['password'] },
        include: [{
          model: Department,
          attributes: ['id', 'name', 'code']
        }]
      });
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get student by ID
  async getById(req, res) {
    try {
      const student = await Student.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Department,
          attributes: ['id', 'name', 'code']
        }]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update student
  async update(req, res) {
    try {
      const { name, email, password, department_id } = req.body;
      const student = await Student.findByPk(req.params.id);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Check if email is being changed and if it's already in use
      if (email && email !== student.email) {
        const existingStudent = await Student.findOne({
          where: { email }
        });

        if (existingStudent) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      }

      // Check if department exists if department_id is provided
      if (department_id) {
        const department = await Department.findByPk(department_id);
        if (!department) {
          return res.status(404).json({ error: 'Department not found' });
        }
      }

      // Update student
      const updateData = {
        name,
        email,
        department_id
      };

      // Only hash and update password if it's provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await student.update(updateData);

      // Get updated student with department info
      const updatedStudent = await Student.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Department,
          attributes: ['id', 'name', 'code']
        }]
      });

      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete student
  async delete(req, res) {
    try {
      const student = await Student.findByPk(req.params.id);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      await student.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get student's enrollments
  async getEnrollments(req, res) {
    try {
      const student = await Student.findByPk(req.params.id, {
        include: [{
          model: Enrollment,
          include: [{
            model: Course,
            attributes: ['id', 'name', 'code', 'credits']
          }]
        }]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(student.Enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get student's grades
  async getGrades(req, res) {
    try {
      const student = await Student.findByPk(req.params.id, {
        include: [{
          model: Enrollment,
          include: [{
            model: Course,
            attributes: ['id', 'name', 'code', 'credits']
          }, {
            model: Grade,
            attributes: ['id', 'grade', 'grade_letter', 'remarks']
          }]
        }]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Format the response to show grades with course information
      const grades = student.Enrollments.map(enrollment => ({
        enrollment_id: enrollment.id,
        course: enrollment.Course,
        grade: enrollment.Grade,
        semester: enrollment.semester
      }));

      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = studentController; 