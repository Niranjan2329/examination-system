const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireTeacher } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [notifications] = await pool.execute(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    // Count unread notifications
    const [unreadCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      notifications,
      unreadCount: unreadCount[0].count
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [userId]
    );

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Create notification (Teacher only - for exam announcements)
router.post('/create', authenticateToken, requireTeacher, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('type').isIn(['exam_reminder', 'result_available', 'system', 'announcement']).withMessage('Invalid notification type'),
  body('studentIds').optional().isArray().withMessage('Student IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message, type, studentIds } = req.body;
    const teacherId = req.user.id;

    // If studentIds provided, send to specific students
    if (studentIds && studentIds.length > 0) {
      const notifications = [];
      for (const studentId of studentIds) {
        notifications.push([studentId, title, message, type]);
      }

      await pool.execute(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ?',
        [notifications]
      );
    } else {
      // Send to all students
      const [students] = await pool.execute(
        'SELECT id FROM users WHERE role = "student"'
      );

      const notifications = students.map(student => [student.id, title, message, type]);

      if (notifications.length > 0) {
        await pool.execute(
          'INSERT INTO notifications (user_id, title, message, type) VALUES ?',
          [notifications]
        );
      }
    }

    res.status(201).json({ message: 'Notifications created successfully' });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notifications' });
  }
});

// Get notification statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [stats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_notifications,
        COUNT(CASE WHEN type = 'exam_reminder' THEN 1 END) as exam_reminders,
        COUNT(CASE WHEN type = 'result_available' THEN 1 END) as result_notifications,
        COUNT(CASE WHEN type = 'announcement' THEN 1 END) as announcements,
        COUNT(CASE WHEN type = 'system' THEN 1 END) as system_notifications
       FROM notifications 
       WHERE user_id = ?`,
      [userId]
    );

    res.json({ stats: stats[0] });

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ error: 'Failed to get notification statistics' });
  }
});

// Helper function to create exam reminder notifications
const createExamReminders = async (examId, examTitle, startTime) => {
  try {
    const [students] = await pool.execute(
      'SELECT id FROM users WHERE role = "student"'
    );

    const reminderTime = new Date(startTime);
    reminderTime.setHours(reminderTime.getHours() - 1); // 1 hour before exam

    const notifications = students.map(student => [
      student.id,
      'Exam Reminder',
      `Reminder: ${examTitle} starts in 1 hour. Please be prepared!`,
      'exam_reminder'
    ]);

    if (notifications.length > 0) {
      await pool.execute(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ?',
        [notifications]
      );
    }
  } catch (error) {
    console.error('Create exam reminders error:', error);
  }
};

// Helper function to create result notifications
const createResultNotifications = async (examId, examTitle, studentId) => {
  try {
    const [result] = await pool.execute(
      'SELECT percentage, status FROM exam_results WHERE exam_id = ? AND student_id = ?',
      [examId, studentId]
    );

    if (result.length > 0) {
      const { percentage, status } = result[0];
      const message = `Your result for "${examTitle}" is available. Score: ${percentage}% (${status})`;
      
      await pool.execute(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [studentId, 'Result Available', message, 'result_available']
      );
    }
  } catch (error) {
    console.error('Create result notification error:', error);
  }
};

// Helper function to create system notifications
const createSystemNotification = async (userId, title, message) => {
  try {
    await pool.execute(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [userId, title, message, 'system']
    );
  } catch (error) {
    console.error('Create system notification error:', error);
  }
};

module.exports = router; 