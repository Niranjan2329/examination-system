import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get('/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Add new notification (for real-time updates)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.is_read) {
      setUnreadCount(prev => prev + 1);
      
      // Show toast for new notifications
      toast(notification.message, {
        icon: getNotificationIcon(notification.type),
        duration: 5000,
      });
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'exam_reminder':
        return '📝';
      case 'result_available':
        return '📊';
      case 'announcement':
        return '📢';
      case 'system':
        return '⚙️';
      default:
        return '📌';
    }
  };

  // Get notification statistics
  const getNotificationStats = () => {
    const stats = {
      total: notifications.length,
      unread: unreadCount,
      exam_reminders: notifications.filter(n => n.type === 'exam_reminder').length,
      result_notifications: notifications.filter(n => n.type === 'result_available').length,
      announcements: notifications.filter(n => n.type === 'announcement').length,
      system: notifications.filter(n => n.type === 'system').length,
    };
    return stats;
  };

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getNotificationStats,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 