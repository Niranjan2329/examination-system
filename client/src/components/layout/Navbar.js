import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  FiHome, 
  FiUser, 
  FiBell, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiBookOpen,
  FiBarChart,
  FiCalendar,
  FiAward
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', icon: FiHome, path: '/teacher' },
        { name: 'Create Exam', icon: FiBookOpen, path: '/teacher/create-exam' },
        { name: 'My Exams', icon: FiCalendar, path: '/teacher/exams' },
        { name: 'Results', icon: FiBarChart, path: '/teacher/results' },
      ];
    } else {
      return [
        { name: 'Dashboard', icon: FiHome, path: '/student' },
        { name: 'Available Exams', icon: FiBookOpen, path: '/student/exams' },
        { name: 'Exam History', icon: FiAward, path: '/student/history' },
      ];
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <FiBookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ExamSystem</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 relative">
                <FiBell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiUser className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 w-full text-left"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
