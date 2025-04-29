const { Department, Student, Course, Instructor } = require('../models');
const { validationResult } = require('express-validator');

const departmentController = {
  // Create a new department
  async create(req, res) {
    try {
      const { name, code, description } = req.body;
      
      // Check if department with same code exists
      const existingDepartment = await Department.findOne({
        where: { code }
      });

      if (existingDepartment) {
        return res.status(400).json({ error: 'Department with this code already exists' });
      }

      const department = await Department.create({
        name,
        code,
        description
      });

      res.status(201).json(department);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all departments
  async getAll(req, res) {
    try {
      const departments = await Department.findAll();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get department by ID
  async getById(req, res) {
    try {
      const department = await Department.findByPk(req.params.id);

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      res.json(department);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update department
  async update(req, res) {
    try {
      const { name, code, description } = req.body;
      const department = await Department.findByPk(req.params.id);

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      // Check if another department has the same code
      if (code && code !== department.code) {
        const existingDepartment = await Department.findOne({
          where: { code }
        });

        if (existingDepartment) {
          return res.status(400).json({ error: 'Department with this code already exists' });
        }
      }

      await department.update({
        name,
        code,
        description
      });

      res.json(department);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete department
  async delete(req, res) {
    try {
      const department = await Department.findByPk(req.params.id);

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      await department.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get department's students
  async getStudents(req, res) {
    try {
      const department = await Department.findByPk(req.params.id, {
        include: [{
          model: Student,
          attributes: ['id', 'name', 'email', 'enrollment_date']
        }]
      });

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      res.json(department.Students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get department's courses
  async getCourses(req, res) {
    try {
      const department = await Department.findByPk(req.params.id, {
        include: [{
          model: Course,
          attributes: ['id', 'name', 'code', 'credits']
        }]
      });

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      res.json(department.Courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get department's instructors
  async getInstructors(req, res) {
    try {
      const department = await Department.findByPk(req.params.id, {
        include: [{
          model: Instructor,
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }

      res.json(department.Instructors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = departmentController; 