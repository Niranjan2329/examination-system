const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload profile picture
router.post('/upload-profile-picture', authenticateToken, upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.id;
    const profilePicturePath = req.file.path.replace(/\\/g, '/'); // Normalize path for cross-platform

    // Update user profile with new picture path
    await pool.execute(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profilePicturePath, userId]
    );

    res.json({
      message: 'Profile picture uploaded successfully',
      profile_picture: profilePicturePath
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Get user profile
router.get('/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Check access permissions
    if (userRole === 'student' && parseInt(userId) !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [users] = await pool.execute(
      `SELECT id, name, email, role, profile_picture, department, student_id, teacher_id, 
              phone, address, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile/:userId', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('department').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.userId;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Check access permissions
    if (userRole === 'student' && parseInt(userId) !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, phone, address, department } = req.body;

    // Update user profile
    const [result] = await pool.execute(
      `UPDATE users SET 
       name = COALESCE(?, name),
       phone = COALESCE(?, phone),
       address = COALESCE(?, address),
       department = COALESCE(?, department),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, phone, address, department, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user
    const [users] = await pool.execute(
      `SELECT id, name, email, role, profile_picture, department, student_id, teacher_id, 
              phone, address, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: users[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all students (for teachers)
router.get('/students', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [students] = await pool.execute(
      `SELECT id, name, email, student_id, department, profile_picture, created_at
       FROM users 
       WHERE role = 'student'
       ORDER BY name ASC`
    );

    res.json({ students });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// Get all teachers (for students)
router.get('/teachers', authenticateToken, async (req, res) => {
  try {
    const [teachers] = await pool.execute(
      `SELECT id, name, email, teacher_id, department, profile_picture, created_at
       FROM users 
       WHERE role = 'teacher'
       ORDER BY name ASC`
    );

    res.json({ teachers });

  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Failed to get teachers' });
  }
});

// Search users
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query, role } = req.query;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    let sql = `SELECT id, name, email, role, profile_picture, department, student_id, teacher_id
               FROM users WHERE id != ?`;
    let params = [currentUserId];

    if (query) {
      sql += ` AND (name LIKE ? OR email LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    if (role) {
      sql += ` AND role = ?`;
      params.push(role);
    }

    sql += ` ORDER BY name ASC LIMIT 20`;

    const [users] = await pool.execute(sql, params);

    res.json({ users });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get user statistics
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Check access permissions
    if (userRole === 'student' && parseInt(userId) !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [user] = await pool.execute(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let stats = {};

    if (user[0].role === 'student') {
      // Student statistics
      const [examStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_exams,
          COUNT(CASE WHEN status = 'passed' THEN 1 END) as passed_exams,
          AVG(percentage) as average_score,
          MAX(percentage) as highest_score,
          MIN(percentage) as lowest_score
         FROM exam_results 
         WHERE student_id = ?`,
        [userId]
      );

      const [subjectStats] = await pool.execute(
        `SELECT 
          e.subject,
          COUNT(er.id) as exam_count,
          AVG(er.percentage) as average_score
         FROM exam_results er
         JOIN exams e ON er.exam_id = e.id
         WHERE er.student_id = ?
         GROUP BY e.subject
         ORDER BY average_score DESC`,
        [userId]
      );

      stats = {
        examStats: examStats[0],
        subjectStats
      };

    } else if (user[0].role === 'teacher') {
      // Teacher statistics
      const [examStats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_exams,
          COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_exams,
          AVG(duration) as average_duration
         FROM exams 
         WHERE teacher_id = ?`,
        [userId]
      );

      const [studentStats] = await pool.execute(
        `SELECT 
          COUNT(DISTINCT er.student_id) as total_students,
          AVG(er.percentage) as average_student_score
         FROM exam_results er
         JOIN exams e ON er.exam_id = e.id
         WHERE e.teacher_id = ?`,
        [userId]
      );

      stats = {
        examStats: examStats[0],
        studentStats: studentStats[0]
      };
    }

    res.json({ stats });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

// Delete profile picture
router.delete('/profile-picture', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current profile picture
    const [users] = await pool.execute(
      'SELECT profile_picture FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPicture = users[0].profile_picture;

    // Remove profile picture from database
    await pool.execute(
      'UPDATE users SET profile_picture = NULL WHERE id = ?',
      [userId]
    );

    // Delete file from filesystem
    if (currentPicture && fs.existsSync(currentPicture)) {
      fs.unlinkSync(currentPicture);
    }

    res.json({ message: 'Profile picture deleted successfully' });

  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ error: 'Failed to delete profile picture' });
  }
});

module.exports = router; 