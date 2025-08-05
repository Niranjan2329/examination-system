const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'examination_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('teacher', 'student') NOT NULL,
        profile_picture VARCHAR(500),
        department VARCHAR(255),
        student_id VARCHAR(50),
        teacher_id VARCHAR(50),
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create exams table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(255) NOT NULL,
        duration INT NOT NULL, -- in minutes
        total_marks INT NOT NULL,
        passing_marks INT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        teacher_id INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create questions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exam_id INT NOT NULL,
        question_text TEXT NOT NULL,
        question_type ENUM('multiple_choice', 'true_false', 'short_answer', 'essay') NOT NULL,
        options JSON,
        correct_answer TEXT,
        marks INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
      )
    `);

    // Create exam_results table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exam_id INT NOT NULL,
        student_id INT NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        total_marks INT NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        time_taken INT, -- in minutes
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('passed', 'failed', 'pending') DEFAULT 'pending',
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_exam_student (exam_id, student_id)
      )
    `);

    // Create student_answers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS student_answers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exam_result_id INT NOT NULL,
        question_id INT NOT NULL,
        student_answer TEXT,
        is_correct BOOLEAN,
        marks_obtained DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_result_id) REFERENCES exam_results(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      )
    `);

    // Create notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('exam_reminder', 'result_available', 'system', 'announcement') NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create certificates table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exam_result_id INT NOT NULL,
        certificate_number VARCHAR(255) UNIQUE NOT NULL,
        issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('active', 'revoked') DEFAULT 'active',
        FOREIGN KEY (exam_result_id) REFERENCES exam_results(id) ON DELETE CASCADE
      )
    `);

    // Insert sample data
    await insertSampleData(connection);
    
    connection.release();
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Insert sample data
const insertSampleData = async (connection) => {
  try {
    // Check if sample data already exists
    const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
      console.log('📝 Sample data already exists, skipping...');
      return;
    }

    // Insert sample teachers
    await connection.execute(`
      INSERT INTO users (name, email, password, role, department, teacher_id) VALUES
      ('Dr. Sarah Johnson', 'sarah.johnson@university.edu', '$2a$10$hashedpassword', 'teacher', 'Computer Science', 'T001'),
      ('Prof. Michael Chen', 'michael.chen@university.edu', '$2a$10$hashedpassword', 'teacher', 'Mathematics', 'T002'),
      ('Dr. Emily Davis', 'emily.davis@university.edu', '$2a$10$hashedpassword', 'teacher', 'Physics', 'T003')
    `);

    // Insert sample students
    await connection.execute(`
      INSERT INTO users (name, email, password, role, student_id) VALUES
      ('John Smith', 'john.smith@student.edu', '$2a$10$hashedpassword', 'student', 'S001'),
      ('Alice Brown', 'alice.brown@student.edu', '$2a$10$hashedpassword', 'student', 'S002'),
      ('David Wilson', 'david.wilson@student.edu', '$2a$10$hashedpassword', 'student', 'S003'),
      ('Emma Taylor', 'emma.taylor@student.edu', '$2a$10$hashedpassword', 'student', 'S004'),
      ('James Anderson', 'james.anderson@student.edu', '$2a$10$hashedpassword', 'student', 'S005')
    `);

    console.log('✅ Sample data inserted successfully');
  } catch (error) {
    console.error('❌ Sample data insertion failed:', error);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 