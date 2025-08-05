import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBookOpen, 
  FiAward, 
  FiTrendingUp, 
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiBarChart
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    examsTaken: 8,
    averageScore: 82.5,
    rank: 5,
    totalStudents: 45
  });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setUpcomingExams([
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          teacher: 'Dr. Sarah Johnson',
          date: '2024-01-20',
          time: '10:00 AM',
          duration: '60 min',
          questions: 25
        },
        {
          id: 2,
          title: 'React Development',
          teacher: 'Prof. Mike Chen',
          date: '2024-01-25',
          time: '2:00 PM',
          duration: '90 min',
          questions: 30
        },
        {
          id: 3,
          title: 'Database Management',
          teacher: 'Dr. Emily Davis',
          date: '2024-01-30',
          time: '11:00 AM',
          duration: '75 min',
          questions: 20
        }
      ]);

      setRecentResults([
        {
          id: 1,
          title: 'Web Development Basics',
          score: 85,
          total: 100,
          date: '2024-01-10',
          status: 'completed'
        },
        {
          id: 2,
          title: 'HTML & CSS',
          score: 92,
          total: 100,
          date: '2024-01-05',
          status: 'completed'
        },
        {
          id: 3,
          title: 'JavaScript Essentials',
          score: 78,
          total: 100,
          date: '2023-12-28',
          status: 'completed'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const performanceData = [
    { subject: 'Web Dev', score: 85 },
    { subject: 'HTML/CSS', score: 92 },
    { subject: 'JavaScript', score: 78 },
    { subject: 'React', score: 88 },
    { subject: 'Database', score: 82 }
  ];

  const subjectBreakdown = [
    { name: 'Excellent (90-100)', value: 2, color: '#10b981' },
    { name: 'Good (80-89)', value: 3, color: '#3b82f6' },
    { name: 'Average (70-79)', value: 2, color: '#f59e0b' },
    { name: 'Needs Improvement', value: 1, color: '#ef4444' }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Ready to ace your next exam? Here's what's coming up.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exams Taken</p>
                <p className="text-2xl font-bold text-gray-900">{stats.examsTaken}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiAward className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Class Rank</p>
                <p className="text-2xl font-bold text-gray-900">#{stats.rank}</p>
                <p className="text-xs text-gray-500">of {stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiClock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingExams.length}</p>
                <p className="text-xs text-gray-500">exams</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {subjectBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Exams */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Exams</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{exam.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {exam.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">by {exam.teacher}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 mr-1" />
                        {exam.date}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="h-4 w-4 mr-1" />
                        {exam.time}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{exam.questions} questions</span>
                      <Link
                        to={`/student/exam/${exam.id}`}
                        className="text-sm bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 transition-colors duration-200"
                      >
                        Start Exam
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Results</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{result.title}</h4>
                      <div className="flex items-center">
                        <FiCheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">Completed</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiBarChart className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Score: {result.score}/{result.total}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {Math.round((result.score / result.total) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">{result.date}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(result.score / result.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
