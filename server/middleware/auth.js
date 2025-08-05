const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const [users] = await pool.execute(
      'SELECT id, name, email, role, profile_picture, department, student_id, teacher_id FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user is a teacher
const requireTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher access required' });
  }
  next();
};

// Middleware to check if user is a student
const requireStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Student access required' });
  }
  next();
};

// Middleware to check if user owns the resource or is admin
const requireOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[paramName];
    const userId = req.user.id;
    const userRole = req.user.role;

    // Teachers can access their own resources
    if (userRole === 'teacher' && parseInt(resourceId) === userId) {
      return next();
    }

    // Students can access their own resources
    if (userRole === 'student' && parseInt(resourceId) === userId) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied' });
  };
};

module.exports = {
  authenticateToken,
  requireTeacher,
  requireStudent,
  requireOwnership
}; 