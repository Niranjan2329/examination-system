const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 Starting database setup...');

    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'examination_system';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created/verified`);

    // Use the database
    await connection.changeUser({ database: dbName });

    // Create tables
    console.log('📋 Creating tables...');

    // Users table
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
    console.log('✅ Users table created');

    // Exams table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
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
    console.log('✅ Exams table created');

    // Questions table
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
    console.log('✅ Questions table created');

    // Exam results table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exam_id INT NOT NULL,
        student_id INT NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        total_marks INT NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        time_taken INT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('passed', 'failed', 'pending') DEFAULT 'pending',
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_exam_student (exam_id, student_id)
      )
    `);
    console.log('✅ Exam results table created');

    // Student answers table
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
    console.log('✅ Student answers table created');

    // Notifications table
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
    console.log('✅ Notifications table created');

    // Certificates table
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
    console.log('✅ Certificates table created');

    // Insert sample data
    console.log('📝 Inserting sample data...');
    await insertSampleData(connection);

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Sample data inserted:');
    console.log('- 3 Teachers');
    console.log('- 5 Students');
    console.log('- Sample exams and questions');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function insertSampleData(connection) {
  try {
    // Check if sample data already exists
    const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
      console.log('📝 Sample data already exists, skipping...');
      return;
    }

    // Hash password for sample users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Insert sample teachers
    const [teacherResult] = await connection.execute(`
      INSERT INTO users (name, email, password, role, department, teacher_id) VALUES
      ('Dr. Sarah Johnson', 'sarah.johnson@university.edu', ?, 'teacher', 'Computer Science', 'T001'),
      ('Prof. Michael Chen', 'michael.chen@university.edu', ?, 'teacher', 'Mathematics', 'T002'),
      ('Dr. Emily Davis', 'emily.davis@university.edu', ?, 'teacher', 'Physics', 'T003')
    `, [hashedPassword, hashedPassword, hashedPassword]);

    console.log('✅ Sample teachers inserted');

    // Insert sample students
    await connection.execute(`
      INSERT INTO users (name, email, password, role, student_id) VALUES
      ('John Smith', 'john.smith@student.edu', ?, 'student', 'S001'),
      ('Alice Brown', 'alice.brown@student.edu', ?, 'student', 'S002'),
      ('David Wilson', 'david.wilson@student.edu', ?, 'student', 'S003'),
      ('Emma Taylor', 'emma.taylor@student.edu', ?, 'student', 'S004'),
      ('James Anderson', 'james.anderson@student.edu', ?, 'student', 'S005')
    `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

    console.log('✅ Sample students inserted');

    // Insert sample exams
    const [examResult] = await connection.execute(`
      INSERT INTO exams (title, description, subject, duration, total_marks, passing_marks, start_time, end_time, teacher_id) VALUES
      ('Introduction to Programming', 'Basic programming concepts and logic', 'Computer Science', 60, 100, 40, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY + INTERVAL 1 HOUR), 1),
      ('Calculus Fundamentals', 'Basic calculus concepts and applications', 'Mathematics', 90, 100, 50, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY + INTERVAL 1 HOUR + INTERVAL 30 MINUTE), 2),
      ('Physics Mechanics', 'Classical mechanics and motion', 'Physics', 75, 100, 45, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + INTERVAL 1 HOUR + INTERVAL 15 MINUTE), 3)
    `);

    console.log('✅ Sample exams inserted');

    // Insert sample questions for the first exam
    await connection.execute(`
      INSERT INTO questions (exam_id, question_text, question_type, options, correct_answer, marks) VALUES
      (1, 'What is a variable in programming?', 'multiple_choice', '["A storage location", "A function", "A loop", "A comment"]', 'A storage location', 10),
      (1, 'Which of the following is a programming language?', 'multiple_choice', '["HTML", "CSS", "JavaScript", "All of the above"]', 'JavaScript', 10),
      (1, 'What does HTML stand for?', 'multiple_choice', '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"]', 'Hyper Text Markup Language', 10),
      (1, 'Is JavaScript a case-sensitive language?', 'true_false', '["True", "False"]', 'True', 5),
      (1, 'Explain the concept of loops in programming.', 'essay', '[]', 'Loops are control structures that allow repeated execution of code blocks until a condition is met.', 15)
    `);

    console.log('✅ Sample questions inserted');

    // Create uploads directory
    const fs = require('fs');
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✅ Uploads directory created');
    }

  } catch (error) {
    console.error('❌ Sample data insertion failed:', error);
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n🎯 Setup completed! You can now start the application.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase }; 