import React, { useState, useEffect } from 'react';
import { 
  FiBarChart, 
  FiUsers, 
  FiTrendingUp, 
  FiTrendingDown,
  FiDownload
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ExamResults = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setExams([
        { id: 1, title: 'JavaScript Fundamentals', totalStudents: 45, averageScore: 82 },
        { id: 2, title: 'React Development', totalStudents: 38, averageScore: 75 },
        { id: 3, title: 'Database Management', totalStudents: 52, averageScore: 79 }
      ]);

      setResults([
        {
          id: 1,
          studentName: 'John Doe',
          email: 'john.doe@example.com',
          score: 85,
          totalQuestions: 25,
          correctAnswers: 21,
          timeTaken: 45,
          submittedAt: '2024-01-20T10:30:00',
          rank: 3
        },
        {
          id: 2,
          studentName: 'Jane Smith',
          email: 'jane.smith@example.com',
          score: 92,
          totalQuestions: 25,
          correctAnswers: 23,
          timeTaken: 52,
          submittedAt: '2024-01-20T10:25:00',
          rank: 1
        },
        {
          id: 3,
          studentName: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          score: 78,
          totalQuestions: 25,
          correctAnswers: 19,
          timeTaken: 58,
          submittedAt: '2024-01-20T10:35:00',
          rank: 5
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const scoreDistribution = [
    { range: '90-100', count: 8, color: '#10b981' },
    { range: '80-89', count: 12, color: '#3b82f6' },
    { range: '70-79', count: 15, color: '#f59e0b' },
    { range: '60-69', count: 6, color: '#ef4444' },
    { range: '0-59', count: 4, color: '#dc2626' }
  ];

  const performanceData = [
    { question: 'Q1', correct: 85, incorrect: 15 },
    { question: 'Q2', correct: 92, incorrect: 8 },
    { question: 'Q3', correct: 78, incorrect: 22 },
    { question: 'Q4', correct: 88, incorrect: 12 },
    { question: 'Q5', correct: 95, incorrect: 5 }
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
          <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
          <p className="text-gray-600 mt-2">Analyze student performance and exam statistics</p>
        </div>

        {/* Exam Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Exam</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                  selectedExam?.id === exam.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium text-gray-900">{exam.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {exam.totalStudents} students • {exam.averageScore}% avg
                </p>
              </button>
            ))}
          </div>
        </div>

        {selectedExam && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiUsers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedExam.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                <FiBarChart className="h-6 w-6 text-green-600" />
              </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedExam.averageScore}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FiTrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Highest Score</p>
                    <p className="text-2xl font-bold text-gray-900">98%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FiTrendingDown className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Lowest Score</p>
                    <p className="text-2xl font-bold text-gray-900">45%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Score Distribution */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {scoreDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-600">{item.range}</span>
                      </div>
                      <span className="font-medium">{item.count} students</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Performance */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Performance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="question" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="correct" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="incorrect" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Student Results</h3>
                  <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
                    <FiDownload className="h-4 w-4 mr-2" />
                    Export Results
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Taken
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{result.rank}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                            <div className="text-sm text-gray-500">{result.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{result.score}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${result.score}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {result.correctAnswers}/{result.totalQuestions}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((result.correctAnswers / result.totalQuestions) * 100)}% correct
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.timeTaken} min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(result.submittedAt).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamResults;
