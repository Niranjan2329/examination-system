import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiUsers,
  FiClock,
  FiCalendar,
  FiBarChart,
  FiBookOpen
} from 'react-icons/fi';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setExams([
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          subject: 'JavaScript',
          status: 'active',
          startDate: '2024-01-20T10:00',
          endDate: '2024-01-20T11:00',
          duration: 60,
          totalStudents: 45,
          completedStudents: 38,
          averageScore: 82,
          totalQuestions: 25
        },
        {
          id: 2,
          title: 'React Development',
          subject: 'React',
          status: 'upcoming',
          startDate: '2024-01-25T14:00',
          endDate: '2024-01-25T15:30',
          duration: 90,
          totalStudents: 52,
          completedStudents: 0,
          averageScore: 0,
          totalQuestions: 30
        },
        {
          id: 3,
          title: 'Database Management',
          subject: 'Database',
          status: 'completed',
          startDate: '2024-01-15T09:00',
          endDate: '2024-01-15T10:15',
          duration: 75,
          totalStudents: 38,
          completedStudents: 38,
          averageScore: 79,
          totalQuestions: 20
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
              <p className="text-gray-600 mt-2">Manage and monitor your examinations</p>
            </div>
            <Link
              to="/teacher/create-exam"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Create New Exam
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search exams..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.reduce((sum, exam) => sum + exam.totalStudents, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiBarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(exams.reduce((sum, exam) => sum + exam.averageScore, 0) / exams.length)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiClock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(exam => exam.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Exam List</h3>
          </div>
          
          {filteredExams.length === 0 ? (
            <div className="p-12 text-center">
              <FiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No exams found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                          <div className="text-sm text-gray-500">{exam.subject}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {exam.totalQuestions} questions • {exam.duration} min
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FiCalendar className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(exam.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(exam.startDate).toLocaleTimeString()} - {new Date(exam.endDate).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {exam.completedStudents}/{exam.totalStudents}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((exam.completedStudents / exam.totalStudents) * 100)}% completed
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {exam.averageScore > 0 ? `${exam.averageScore}%` : 'N/A'}
                        </div>
                        {exam.averageScore > 0 && (
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${exam.averageScore}%` }}
                            ></div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/teacher/exam/${exam.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/teacher/exam/${exam.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FiEdit className="h-4 w-4" />
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamList;
