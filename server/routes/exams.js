const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireTeacher, requireStudent } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Create new exam (Teacher only)
router.post('/create', authenticateToken, requireTeacher, [
  body('title').trim().notEmpty().withMessage('Exam title is required'),
  body('description').optional().trim(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes'),
  body('total_marks').isInt({ min: 1 }).withMessage('Total marks must be positive'),
  body('passing_marks').isInt({ min: 1 }).withMessage('Passing marks must be positive'),
  body('start_time').isISO8601().withMessage('Start time must be a valid date'),
  body('end_time').isISO8601().withMessage('End time must be a valid date'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title, description, subject, duration, total_marks, passing_marks,
      start_time, end_time, questions
    } = req.body;

    const teacherId = req.user.id;

    // Validate passing marks
    if (passing_marks > total_marks) {
      return res.status(400).json({ error: 'Passing marks cannot exceed total marks' });
    }

    // Validate time range
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    if (startDate >= endDate) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create exam
      const [examResult] = await connection.execute(
        `INSERT INTO exams (title, description, subject, duration, total_marks, passing_marks, start_time, end_time, teacher_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, subject, duration, total_marks, passing_marks, start_time, end_time, teacherId]
      );

      const examId = examResult.insertId;

      // Insert questions
      for (const question of questions) {
        await connection.execute(
          `INSERT INTO questions (exam_id, question_text, question_type, options, correct_answer, marks)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            examId,
            question.question_text,
            question.question_type,
            JSON.stringify(question.options || []),
            question.correct_answer,
            question.marks
          ]
        );
      }

      await connection.commit();

      // Get created exam with questions
      const [exams] = await connection.execute(
        `SELECT e.*, u.name as teacher_name 
         FROM exams e 
         JOIN users u ON e.teacher_id = u.id 
         WHERE e.id = ?`,
        [examId]
      );

      const [examQuestions] = await connection.execute(
        'SELECT * FROM questions WHERE exam_id = ?',
        [examId]
      );

      res.status(201).json({
        message: 'Exam created successfully',
        exam: { ...exams[0], questions: examQuestions }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Get teacher's exams
router.get('/teacher/:teacherId', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    
    // Verify teacher owns the exams
    if (parseInt(teacherId) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [exams] = await pool.execute(
      `SELECT e.*, 
              COUNT(DISTINCT er.student_id) as total_students,
              COUNT(CASE WHEN er.status = 'passed' THEN 1 END) as passed_students,
              AVG(er.percentage) as average_score
       FROM exams e
       LEFT JOIN exam_results er ON e.id = er.exam_id
       WHERE e.teacher_id = ?
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
      [teacherId]
    );

    res.json({ exams });
  } catch (error) {
    console.error('Get teacher exams error:', error);
    res.status(500).json({ error: 'Failed to get exams' });
  }
});

// Get available exams for students
router.get('/available', authenticateToken, requireStudent, async (req, res) => {
  try {
    const studentId = req.user.id;
    const currentTime = new Date();

    // Get exams that are currently available (within time window and not taken)
    const [exams] = await pool.execute(
      `SELECT e.*, u.name as teacher_name,
              CASE WHEN er.id IS NOT NULL THEN 'completed' 
                   WHEN NOW() < e.start_time THEN 'upcoming'
                   WHEN NOW() BETWEEN e.start_time AND e.end_time THEN 'available'
                   ELSE 'expired' END as status,
              er.score as student_score,
              er.percentage as student_percentage
       FROM exams e
       JOIN users u ON e.teacher_id = u.id
       LEFT JOIN exam_results er ON e.id = er.exam_id AND er.student_id = ?
       WHERE e.is_active = TRUE
       ORDER BY e.start_time ASC`,
      [studentId]
    );

    res.json({ exams });
  } catch (error) {
    console.error('Get available exams error:', error);
    res.status(500).json({ error: 'Failed to get available exams' });
  }
});

// Get exam details (for taking exam)
router.get('/:examId', authenticateToken, async (req, res) => {
  try {
    const examId = req.params.examId;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get exam details
    const [exams] = await pool.execute(
      `SELECT e.*, u.name as teacher_name
       FROM exams e
       JOIN users u ON e.teacher_id = u.id
       WHERE e.id = ?`,
      [examId]
    );

    if (exams.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const exam = exams[0];

    // Check if student has already taken this exam
    if (userRole === 'student') {
      const [results] = await pool.execute(
        'SELECT * FROM exam_results WHERE exam_id = ? AND student_id = ?',
        [examId, userId]
      );

      if (results.length > 0) {
        return res.status(400).json({ error: 'You have already taken this exam' });
      }
    }

    // Get questions (without correct answers for students)
    const [questions] = await pool.execute(
      'SELECT id, question_text, question_type, options, marks FROM questions WHERE exam_id = ?',
      [examId]
    );

    // Remove correct answers for students
    const examData = {
      ...exam,
      questions: questions.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : []
      }))
    };

    res.json({ exam: examData });
  } catch (error) {
    console.error('Get exam details error:', error);
    res.status(500).json({ error: 'Failed to get exam details' });
  }
});

// Submit exam answers
router.post('/:examId/submit', authenticateToken, requireStudent, [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('time_taken').isInt({ min: 1 }).withMessage('Time taken must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const examId = req.params.examId;
    const studentId = req.user.id;
    const { answers, time_taken } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if exam exists and is active
      const [exams] = await connection.execute(
        'SELECT * FROM exams WHERE id = ? AND is_active = TRUE',
        [examId]
      );

      if (exams.length === 0) {
        return res.status(404).json({ error: 'Exam not found or inactive' });
      }

      const exam = exams[0];

      // Check if student has already taken this exam
      const [existingResults] = await connection.execute(
        'SELECT id FROM exam_results WHERE exam_id = ? AND student_id = ?',
        [examId, studentId]
      );

      if (existingResults.length > 0) {
        return res.status(400).json({ error: 'You have already taken this exam' });
      }

      // Check if exam is still available
      const currentTime = new Date();
      if (currentTime < new Date(exam.start_time) || currentTime > new Date(exam.end_time)) {
        return res.status(400).json({ error: 'Exam is not available at this time' });
      }

      // Get exam questions with correct answers
      const [questions] = await connection.execute(
        'SELECT * FROM questions WHERE exam_id = ?',
        [examId]
      );

      // Calculate score
      let totalScore = 0;
      let correctAnswers = 0;

      // Create exam result
      const [resultInsert] = await connection.execute(
        `INSERT INTO exam_results (exam_id, student_id, score, total_marks, percentage, time_taken, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [examId, studentId, 0, exam.total_marks, 0, time_taken, 'pending']
      );

      const examResultId = resultInsert.insertId;

      // Process each answer
      for (const answer of answers) {
        const question = questions.find(q => q.id === answer.question_id);
        if (!question) continue;

        let isCorrect = false;
        let marksObtained = 0;

        // Check if answer is correct
        if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
          isCorrect = answer.student_answer === question.correct_answer;
          marksObtained = isCorrect ? question.marks : 0;
        } else {
          // For subjective questions, assign partial marks based on keyword matching
          const studentAnswer = answer.student_answer.toLowerCase();
          const correctAnswer = question.correct_answer.toLowerCase();
          
          // Simple keyword matching (can be improved with AI)
          const keywords = correctAnswer.split(' ').filter(word => word.length > 3);
          const matchedKeywords = keywords.filter(keyword => 
            studentAnswer.includes(keyword)
          );
          
          const matchPercentage = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0;
          marksObtained = Math.round(question.marks * matchPercentage);
          isCorrect = matchPercentage >= 0.7; // 70% threshold
        }

        if (isCorrect) correctAnswers++;

        // Save student answer
        await connection.execute(
          `INSERT INTO student_answers (exam_result_id, question_id, student_answer, is_correct, marks_obtained)
           VALUES (?, ?, ?, ?, ?)`,
          [examResultId, answer.question_id, answer.student_answer, isCorrect, marksObtained]
        );

        totalScore += marksObtained;
      }

      // Calculate percentage and status
      const percentage = (totalScore / exam.total_marks) * 100;
      const status = percentage >= exam.passing_marks ? 'passed' : 'failed';

      // Update exam result
      await connection.execute(
        `UPDATE exam_results 
         SET score = ?, percentage = ?, status = ?
         WHERE id = ?`,
        [totalScore, percentage, status, examResultId]
      );

      // Create certificate if passed
      if (status === 'passed') {
        const certificateNumber = `CERT-${examId}-${studentId}-${Date.now()}`;
        await connection.execute(
          `INSERT INTO certificates (exam_result_id, certificate_number)
           VALUES (?, ?)`,
          [examResultId, certificateNumber]
        );
      }

      await connection.commit();

      // Get final result
      const [finalResult] = await connection.execute(
        `SELECT er.*, e.title as exam_title, e.passing_marks
         FROM exam_results er
         JOIN exams e ON er.exam_id = e.id
         WHERE er.id = ?`,
        [examResultId]
      );

      res.json({
        message: 'Exam submitted successfully',
        result: {
          ...finalResult[0],
          correct_answers: correctAnswers,
          total_questions: questions.length
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
});

// Update exam (Teacher only)
router.put('/:examId', authenticateToken, requireTeacher, [
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('is_active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const examId = req.params.examId;
    const teacherId = req.user.id;
    const { title, description, is_active } = req.body;

    // Check if exam belongs to teacher
    const [exams] = await pool.execute(
      'SELECT id FROM exams WHERE id = ? AND teacher_id = ?',
      [examId, teacherId]
    );

    if (exams.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    // Update exam
    const [result] = await pool.execute(
      `UPDATE exams SET 
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       is_active = COALESCE(?, is_active),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, is_active, examId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ message: 'Exam updated successfully' });

  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

// Delete exam (Teacher only)
router.delete('/:examId', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const examId = req.params.examId;
    const teacherId = req.user.id;

    // Check if exam belongs to teacher
    const [exams] = await pool.execute(
      'SELECT id FROM exams WHERE id = ? AND teacher_id = ?',
      [examId, teacherId]
    );

    if (exams.length === 0) {
      return res.status(404).json({ error: 'Exam not found or access denied' });
    }

    // Check if any students have taken this exam
    const [results] = await pool.execute(
      'SELECT COUNT(*) as count FROM exam_results WHERE exam_id = ?',
      [examId]
    );

    if (results[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete exam that has been taken by students. Consider deactivating instead.' 
      });
    }

    // Delete exam (cascade will delete questions)
    await pool.execute('DELETE FROM exams WHERE id = ?', [examId]);

    res.json({ message: 'Exam deleted successfully' });

  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

module.exports = router; 