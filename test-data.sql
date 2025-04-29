-- Insert test data for Departments
INSERT INTO Departments (name, code, description, created_at, updated_at) VALUES
('Computer Science', 'CS', 'Department of Computer Science', NOW(), NOW()),
('Mathematics', 'MATH', 'Department of Mathematics', NOW(), NOW()),
('Physics', 'PHYS', 'Department of Physics', NOW(), NOW());

-- Insert test data for Students
INSERT INTO Students (name, email, password, department_id, enrollment_date, created_at, updated_at) VALUES
('John Doe', 'john.doe@example.com', 'password123', 1, NOW(), NOW(), NOW()),
('Jane Smith', 'jane.smith@example.com', 'password123', 2, NOW(), NOW(), NOW()),
('Bob Johnson', 'bob.johnson@example.com', 'password123', 3, NOW(), NOW(), NOW());

-- Insert test data for Instructors
INSERT INTO Instructors (name, email, password, department_id, created_at, updated_at) VALUES
('Prof. Williams', 'williams@example.com', 'password123', 1, NOW(), NOW()),
('Prof. Brown', 'brown@example.com', 'password123', 2, NOW(), NOW()),
('Prof. Davis', 'davis@example.com', 'password123', 3, NOW(), NOW());

-- Insert test data for Courses
INSERT INTO Courses (name, code, credits, department_id, instructor_id, created_at, updated_at) VALUES
('Introduction to Programming', 'CS101', 3, 1, 1, NOW(), NOW()),
('Calculus I', 'MATH101', 3, 2, 2, NOW(), NOW()),
('Classical Mechanics', 'PHYS101', 4, 3, 3, NOW(), NOW());

-- Insert test data for Enrollments
INSERT INTO Enrollments (student_id, course_id, semester, enrollment_date, status, created_at, updated_at) VALUES
(1, 1, 'Fall', NOW(), 'active', NOW(), NOW()),
(1, 2, 'Fall', NOW(), 'active', NOW(), NOW()),
(2, 2, 'Fall', NOW(), 'active', NOW(), NOW()),
(2, 3, 'Fall', NOW(), 'active', NOW(), NOW()),
(3, 1, 'Fall', NOW(), 'active', NOW(), NOW()),
(3, 3, 'Fall', NOW(), 'active', NOW(), NOW());

-- Insert test data for Grades
INSERT INTO Grades (enrollment_id, grade, grade_letter, created_at, updated_at) VALUES
(1, 85.00, 'B', NOW(), NOW()),
(2, 92.00, 'A', NOW(), NOW()),
(3, 78.00, 'C', NOW(), NOW()),
(4, 88.00, 'B+', NOW(), NOW()),
(5, 95.00, 'A', NOW(), NOW()),
(6, 82.00, 'B-', NOW(), NOW()); 