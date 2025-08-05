import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import CreateExam from './pages/teacher/CreateExam';
import ExamList from './pages/teacher/ExamList';
import ExamResults from './pages/teacher/ExamResults';
import AvailableExams from './pages/student/AvailableExams';
import TakeExam from './pages/student/TakeExam';
import ExamHistory from './pages/student/ExamHistory';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Component
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {user && <Navbar />}
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/" replace /> : <Register />
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
              </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teacher/create-exam" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateExam />
              </ProtectedRoute>
            } />
            <Route path="/teacher/exams" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ExamList />
              </ProtectedRoute>
            } />
            <Route path="/teacher/results" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ExamResults />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/exams" element={
              <ProtectedRoute allowedRoles={['student']}>
                <AvailableExams />
              </ProtectedRoute>
            } />
            <Route path="/student/exam/:examId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <TakeExam />
              </ProtectedRoute>
            } />
            <Route path="/student/history" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ExamHistory />
              </ProtectedRoute>
            } />

            {/* Common Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {user && <Footer />}
      </div>
    </Router>
  );
};

// Root App Component
const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App; 