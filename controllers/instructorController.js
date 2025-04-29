const { Instructor, Course, Department } = require('../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const instructorController = {
  // Create a new instructor
  async create(req, res) {
    try {
      const { name, email, password, department_id } = req.body;
      
      // Check if instructor with same email exists
      const existingInstructor = await Instructor.findOne({
        where: { email }
      });

      if (existingInstructor) {
        return res.status(400).json({ error: 'Instructor with this email already exists' });
      }

      // Check if department exists
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const instructor = await Instructor.create({
        name,
        email,
        password: hashedPassword,
        department_id
      });

      // Remove password from response
      const instructorResponse = instructor.toJSON();
      delete instructorResponse.password;

      res.status(201).json(instructorResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all instructors
  async getAll(req, res) {
    try {
      const instructors = await Instructor.findAll({
        attributes: { exclude: ['password'] },
        include: [{
          model: Department,
          attributes: ['id', 'name', 'code']
        }]
      });
      res.json(instructors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get instructor by ID
  async getById(req, res) {
    try {
      const instructor = await Instructor.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Department,
          attributes: ['id', 'name', 'code']
        }]
      });

      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }

      res.json(instructor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update instructor
  async update(req, res) {
    try {
      const { name, email, password, department_id } = req.body;
      const instructor = await Instructor.findByPk(req.params.id);

      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }

      // Check if email is being changed and if it's already in use
      if (email && email !== instructor.email) {
        const existingInstructor = await Instructor.findOne({
          where: { email }
        });

        if (existingInstructor) {
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

      // Update instructor
      const updateData = {
        name,
        email,
        department_id
      };

      // Only hash and update password if it's provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await instructor.update(updateData);

      // Get updated instructor with department info
      const updatedInstructor = await Instructor.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Department,
          attributes: ['id', 'name', 'code']
        }]
      });

      res.json(updatedInstructor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete instructor
  async delete(req, res) {
    try {
      const instructor = await Instructor.findByPk(req.params.id);

      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }

      await instructor.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get instructor's courses
  async getCourses(req, res) {
    try {
      const instructor = await Instructor.findByPk(req.params.id, {
        include: [{
          model: Course,
          attributes: ['id', 'name', 'code', 'credits']
        }]
      });

      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' });
      }

      res.json(instructor.Courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = instructorController; 