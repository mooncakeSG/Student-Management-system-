const request = require('supertest');
const app = require('../app');
const db = require('../models');
const { Student, Course, Enrollment, Grade, Department, Instructor } = db;
const bcrypt = require('bcryptjs');

describe('Grade Controller', () => {
  let student;
  let course;
  let enrollment;
  let grade;
  let department;
  let instructor;

  beforeAll(async () => {
    // Create test data
    department = await Department.create({
      name: 'Test Department',
      code: 'TEST',
      description: 'Test Department Description'
    });

    instructor = await Instructor.create({
      name: 'Test Instructor',
      email: 'instructor@test.com',
      password: await bcrypt.hash('testpassword', 10),
      department_id: department.id,
      specialization: 'Test Specialization'
    });

    student = await Student.create({
      name: 'Test Student',
      email: 'test@example.com',
      phone: '1234567890',
      address: 'Test Address',
      password: await bcrypt.hash('testpassword', 10),
      department_id: department.id
    });

    course = await Course.create({
      name: 'Test Course',
      code: 'TEST101',
      description: 'Test Description',
      credits: 3,
      department_id: department.id,
      instructor_id: instructor.id
    });

    enrollment = await Enrollment.create({
      student_id: student.id,
      course_id: course.id,
      semester: 'Fall 2023',
      status: 'active'
    });
  });

  afterAll(async () => {
    // Clean up test data
    await Grade.destroy({ where: {} });
    await Enrollment.destroy({ where: {} });
    await Course.destroy({ where: {} });
    await Student.destroy({ where: {} });
    await Instructor.destroy({ where: {} });
    await Department.destroy({ where: {} });
    await db.sequelize.close();
  });

  describe('POST /api/grades', () => {
    it('should create a new grade', async () => {
      const response = await request(app)
        .post('/api/grades')
        .send({
          enrollment_id: enrollment.id,
          grade: 85,
          grade_letter: 'B',
          remarks: 'Good performance'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.grade).toBe(85);
      expect(response.body.grade_letter).toBe('B');
      grade = response.body;
    });

    it('should return 400 for invalid grade data', async () => {
      const response = await request(app)
        .post('/api/grades')
        .send({
          enrollment_id: enrollment.id,
          grade: 105, // Invalid grade
          grade_letter: 'A'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/grades', () => {
    it('should get all grades', async () => {
      const response = await request(app).get('/api/grades');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/grades/:id', () => {
    it('should get grade by ID', async () => {
      const response = await request(app).get(`/api/grades/${grade.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(grade.id);
    });

    it('should return 404 for non-existent grade', async () => {
      const response = await request(app).get('/api/grades/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/grades/:id', () => {
    it('should update a grade', async () => {
      const response = await request(app)
        .put(`/api/grades/${grade.id}`)
        .send({
          grade: 90,
          grade_letter: 'A-',
          remarks: 'Excellent performance'
        });

      expect(response.status).toBe(200);
      expect(response.body.grade).toBe(90);
      expect(response.body.grade_letter).toBe('A-');
    });
  });

  describe('GET /api/grades/enrollment/:enrollmentId', () => {
    it('should get grades by enrollment', async () => {
      const response = await request(app)
        .get(`/api/grades/enrollment/${enrollment.id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/grades/student/:studentId', () => {
    it('should get grades by student', async () => {
      const response = await request(app)
        .get(`/api/grades/student/${student.id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/grades/:id', () => {
    it('should delete a grade', async () => {
      const response = await request(app)
        .delete(`/api/grades/${grade.id}`);

      expect(response.status).toBe(204);
    });
  });
}); 