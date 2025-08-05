const express = require('express');
const { authenticateToken, requireTeacher, requireStudent } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get student's exam results
router.get('/student/:studentId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    // Verify student owns the results
    if (parseInt(studentId) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [results] = await pool.execute(
      `SELECT er.*, e.title as exam_title, e.subject, u.name as teacher_name,
              c.certificate_number, c.issued_date
       FROM exam_results er
       JOIN exams e ON er.exam_id = e.id
       JOIN users u ON e.teacher_id = u.id
       LEFT JOIN certificates c ON er.id = c.exam_result_id
       WHERE er.student_id = ?
       ORDER BY er.submitted_at DESC`,
      [studentId]
    );

    // Calculate performance statistics
    const totalExams = results.length;
    const passedExams = results.filter(r => r.status === 'passed').length;
    const averageScore = totalExams > 0 ? 
      results.reduce((sum, r) => sum + parseFloat(r.percentage), 0) / totalExams : 0;

    res.json({
      results,
      statistics: {
        total_exams: totalExams,
        passed_exams: passedExams,
        failed_exams: totalExams - passedExams,
        pass_rate: totalExams > 0 ? (passedExams / totalExams) * 100 : 0,
        average_score: Math.round(averageScore * 100) / 100
      }
    });

  } catch (error) {
    console.error('Get student results error:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

// Get teacher's exam results (for all students)
router.get('/teacher/:teacherId', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    
    // Verify teacher owns the exams
    if (parseInt(teacherId) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [results] = await pool.execute(
      `SELECT er.*, e.title as exam_title, e.subject, e.total_marks, e.passing_marks,
              u.name as student_name, u.student_id as student_roll,
              c.certificate_number
       FROM exam_results er
       JOIN exams e ON er.exam_id = e.id
       JOIN users u ON er.student_id = u.id
       LEFT JOIN certificates c ON er.id = c.exam_result_id
       WHERE e.teacher_id = ?
       ORDER BY er.submitted_at DESC`,
      [teacherId]
    );

    // Group results by exam
    const examResults = {};
    results.forEach(result => {
      if (!examResults[result.exam_id]) {
        examResults[result.exam_id] = {
          exam_title: result.exam_title,
          subject: result.subject,
          total_marks: result.total_marks,
          passing_marks: result.passing_marks,
          students: []
        };
      }
      examResults[result.exam_id].students.push(result);
    });

    // Calculate statistics for each exam
    Object.keys(examResults).forEach(examId => {
      const exam = examResults[examId];
      const students = exam.students;
      const totalStudents = students.length;
      const passedStudents = students.filter(s => s.status === 'passed').length;
      const averageScore = totalStudents > 0 ? 
        students.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / totalStudents : 0;

      exam.statistics = {
        total_students: totalStudents,
        passed_students: passedStudents,
        failed_students: totalStudents - passedStudents,
        pass_rate: totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0,
        average_score: Math.round(averageScore * 100) / 100
      };
    });

    res.json({ examResults });

  } catch (error) {
    console.error('Get teacher results error:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

// Get detailed exam result for a specific student
router.get('/exam/:examId/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check access permissions
    if (userRole === 'student' && parseInt(studentId) !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (userRole === 'teacher') {
      const [examCheck] = await pool.execute(
        'SELECT teacher_id FROM exams WHERE id = ?',
        [examId]
      );
      if (examCheck.length === 0 || examCheck[0].teacher_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get exam result
    const [results] = await pool.execute(
      `SELECT er.*, e.title as exam_title, e.subject, e.total_marks, e.passing_marks,
              u.name as student_name, u.student_id as student_roll
       FROM exam_results er
       JOIN exams e ON er.exam_id = e.id
       JOIN users u ON er.student_id = u.id
       WHERE er.exam_id = ? AND er.student_id = ?`,
      [examId, studentId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    const result = results[0];

    // Get detailed answers
    const [answers] = await pool.execute(
      `SELECT sa.*, q.question_text, q.question_type, q.options, q.correct_answer, q.marks
       FROM student_answers sa
       JOIN questions q ON sa.question_id = q.id
       WHERE sa.exam_result_id = ?`,
      [result.id]
    );

    // Get certificate if exists
    const [certificates] = await pool.execute(
      'SELECT * FROM certificates WHERE exam_result_id = ?',
      [result.id]
    );

    res.json({
      result,
      answers: answers.map(answer => ({
        ...answer,
        options: answer.options ? JSON.parse(answer.options) : []
      })),
      certificate: certificates[0] || null
    });

  } catch (error) {
    console.error('Get detailed result error:', error);
    res.status(500).json({ error: 'Failed to get detailed result' });
  }
});

// Get student ranking for a specific exam
router.get('/exam/:examId/ranking', authenticateToken, async (req, res) => {
  try {
    const examId = req.params.examId;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user has access to this exam
    if (userRole === 'teacher') {
      const [examCheck] = await pool.execute(
        'SELECT teacher_id FROM exams WHERE id = ?',
        [examId]
      );
      if (examCheck.length === 0 || examCheck[0].teacher_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    if (userRole === 'student') {
      const [studentCheck] = await pool.execute(
        'SELECT student_id FROM exam_results WHERE exam_id = ? AND student_id = ?',
        [examId, userId]
      );
      if (studentCheck.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get ranking
    const [ranking] = await pool.execute(
      `SELECT er.*, u.name as student_name, u.student_id as student_roll,
              RANK() OVER (ORDER BY er.percentage DESC, er.time_taken ASC) as rank
       FROM exam_results er
       JOIN users u ON er.student_id = u.id
       WHERE er.exam_id = ?
       ORDER BY er.percentage DESC, er.time_taken ASC`,
      [examId]
    );

    res.json({ ranking });

  } catch (error) {
    console.error('Get ranking error:', error);
    res.status(500).json({ error: 'Failed to get ranking' });
  }
});

// Get student's overall ranking among classmates
router.get('/student/:studentId/class-ranking', authenticateToken, requireStudent, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    if (parseInt(studentId) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get all students' average performance
    const [classRanking] = await pool.execute(
      `SELECT u.id, u.name, u.student_id as student_roll,
              COUNT(er.id) as total_exams,
              AVG(er.percentage) as average_percentage,
              COUNT(CASE WHEN er.status = 'passed' THEN 1 END) as passed_exams,
              RANK() OVER (ORDER BY AVG(er.percentage) DESC) as rank
       FROM users u
       LEFT JOIN exam_results er ON u.id = er.student_id
       WHERE u.role = 'student'
       GROUP BY u.id, u.name, u.student_id
       HAVING total_exams > 0
       ORDER BY average_percentage DESC`
    );

    // Find current student's rank
    const studentRank = classRanking.find(s => s.id === parseInt(studentId));

    res.json({
      classRanking,
      studentRank: studentRank ? {
        rank: studentRank.rank,
        total_students: classRanking.length,
        average_percentage: Math.round(studentRank.average_percentage * 100) / 100,
        total_exams: studentRank.total_exams,
        passed_exams: studentRank.passed_exams
      } : null
    });

  } catch (error) {
    console.error('Get class ranking error:', error);
    res.status(500).json({ error: 'Failed to get class ranking' });
  }
});

// Get performance analytics for student
router.get('/student/:studentId/analytics', authenticateToken, requireStudent, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    if (parseInt(studentId) !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get performance by subject
    const [subjectPerformance] = await pool.execute(
      `SELECT e.subject,
              COUNT(er.id) as total_exams,
              AVG(er.percentage) as average_percentage,
              COUNT(CASE WHEN er.status = 'passed' THEN 1 END) as passed_exams
       FROM exam_results er
       JOIN exams e ON er.exam_id = e.id
       WHERE er.student_id = ?
       GROUP BY e.subject
       ORDER BY average_percentage DESC`,
      [studentId]
    );

    // Get performance over time (last 10 exams)
    const [timePerformance] = await pool.execute(
      `SELECT er.percentage, er.submitted_at, e.title as exam_title, e.subject
       FROM exam_results er
       JOIN exams e ON er.exam_id = e.id
       WHERE er.student_id = ?
       ORDER BY er.submitted_at DESC
       LIMIT 10`,
      [studentId]
    );

    // Get question type performance
    const [questionTypePerformance] = await pool.execute(
      `SELECT q.question_type,
              COUNT(sa.id) as total_questions,
              AVG(sa.marks_obtained) as average_marks,
              COUNT(CASE WHEN sa.is_correct = 1 THEN 1 END) as correct_answers
       FROM student_answers sa
       JOIN questions q ON sa.question_id = q.id
       JOIN exam_results er ON sa.exam_result_id = er.id
       WHERE er.student_id = ?
       GROUP BY q.question_type`,
      [studentId]
    );

    res.json({
      subjectPerformance,
      timePerformance,
      questionTypePerformance
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get certificate
router.get('/certificate/:certificateNumber', authenticateToken, async (req, res) => {
  try {
    const certificateNumber = req.params.certificateNumber;
    const userId = req.user.id;
    const userRole = req.user.role;

    const [certificates] = await pool.execute(
      `SELECT c.*, er.percentage, er.submitted_at,
              e.title as exam_title, e.subject,
              u.name as student_name, u.student_id as student_roll,
              t.name as teacher_name
       FROM certificates c
       JOIN exam_results er ON c.exam_result_id = er.id
       JOIN exams e ON er.exam_id = e.id
       JOIN users u ON er.student_id = u.id
       JOIN users t ON e.teacher_id = t.id
       WHERE c.certificate_number = ?`,
      [certificateNumber]
    );

    if (certificates.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const certificate = certificates[0];

    // Check access permissions
    if (userRole === 'student' && certificate.student_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (userRole === 'teacher' && certificate.teacher_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ certificate });

  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Failed to get certificate' });
  }
});

module.exports = router; 