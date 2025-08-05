import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiClock, 
  FiCalendar,
  FiBookOpen,
  FiUsers,
  FiPlay,
  FiEye
} from 'react-icons/fi';

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setExams([
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          subject: 'JavaScript',
          teacher: 'Dr. Sarah Johnson',
          description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
          startDate: '2024-01-20T10:00:00',
          endDate: '2024-01-20T11:00:00',
          duration: 60,
          totalQuestions: 25,
          totalStudents: 45,
          difficulty: 'Intermediate',
          status: 'available',
          instructions: 'This exam covers JavaScript fundamentals. You have 60 minutes to complete 25 questions.'
        },
        {
          id: 2,
          title: 'React Development',
          subject: 'React',
          teacher: 'Prof. Mike Chen',
          description: 'Comprehensive test on React concepts including components, hooks, and state management.',
          startDate: '2024-01-25T14:00:00',
          endDate: '2024-01-25T15:30:00',
          duration: 90,
          totalQuestions: 30,
          totalStudents: 52,
          difficulty: 'Advanced',
          status: 'upcoming',
          instructions: 'Advanced React concepts exam. 90 minutes for 30 questions.'
        },
        {
          id: 3,
          title: 'Database Management',
          subject: 'Database',
          teacher: 'Dr. Emily Davis',
          description: 'Test your understanding of database concepts, SQL queries, and data modeling.',
          startDate: '2024-01-30T11:00:00',
          endDate: '2024-01-30T12:15:00',
          duration: 75,
          totalQuestions: 20,
          totalStudents: 38,
          difficulty: 'Beginner',
          status: 'upcoming',
          instructions: 'Database fundamentals exam. 75 minutes for 20 questions.'
        },
        {
          id: 4,
          title: 'Web Development Basics',
          subject: 'Web Development',
          teacher: 'Prof. Alex Wilson',
          description: 'Basic web development concepts including HTML, CSS, and JavaScript fundamentals.',
          startDate: '2024-01-15T09:00:00',
          endDate: '2024-01-15T10:00:00',
          duration: 60,
          totalQuestions: 20,
          totalStudents: 60,
          difficulty: 'Beginner',
          status: 'completed',
          instructions: 'Basic web development exam. 60 minutes for 20 questions.'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || exam.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(exams.map(exam => exam.subject))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Exams</h1>
          <p className="text-gray-600 mt-2">Browse and take examinations from your teachers</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search exams, subjects, or teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="h-4 w-4 text-gray-400" />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(exam => exam.status === 'available').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiClock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(exam => exam.status === 'upcoming').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.reduce((sum, exam) => sum + exam.totalStudents, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{exam.title}</h3>
                    <p className="text-sm text-gray-600">by {exam.teacher}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                      {exam.difficulty}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exam.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiBookOpen className="h-4 w-4 mr-2" />
                    {exam.subject}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="h-4 w-4 mr-2" />
                    {exam.duration} minutes • {exam.totalQuestions} questions
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    {new Date(exam.startDate).toLocaleDateString()} at {new Date(exam.startDate).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiUsers className="h-4 w-4 mr-2" />
                    {exam.totalStudents} students enrolled
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600">{exam.instructions}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/student/exam/${exam.id}`}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      exam.status === 'available'
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FiPlay className="h-4 w-4 mr-2" />
                    {exam.status === 'available' ? 'Start Exam' : 'Not Available'}
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <FiEye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <FiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No exams found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableExams;
