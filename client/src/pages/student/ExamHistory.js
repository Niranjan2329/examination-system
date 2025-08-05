import React, { useState, useEffect } from 'react';
import { 
  FiBarChart, 
  FiDownload, 
  FiEye,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExamHistory = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setResults([
        {
          id: 1,
          examTitle: 'JavaScript Fundamentals',
          subject: 'JavaScript',
          teacher: 'Dr. Sarah Johnson',
          score: 85,
          totalQuestions: 25,
          correctAnswers: 21,
          incorrectAnswers: 4,
          timeTaken: 45,
          submittedAt: '2024-01-20T10:30:00',
          status: 'completed',
          rank: 3,
          totalStudents: 45,
          averageScore: 78,
          certificate: 'JS_FUNDAMENTALS_2024_001.pdf'
        },
        {
          id: 2,
          examTitle: 'HTML & CSS Basics',
          subject: 'Web Development',
          teacher: 'Prof. Alex Wilson',
          score: 92,
          totalQuestions: 20,
          correctAnswers: 18,
          incorrectAnswers: 2,
          timeTaken: 35,
          submittedAt: '2024-01-15T14:20:00',
          status: 'completed',
          rank: 1,
          totalStudents: 38,
          averageScore: 82,
          certificate: 'HTML_CSS_2024_001.pdf'
        },
        {
          id: 3,
          examTitle: 'React Development',
          subject: 'React',
          teacher: 'Prof. Mike Chen',
          score: 78,
          totalQuestions: 30,
          correctAnswers: 23,
          incorrectAnswers: 7,
          timeTaken: 75,
          submittedAt: '2024-01-10T11:15:00',
          status: 'completed',
          rank: 8,
          totalStudents: 52,
          averageScore: 75,
          certificate: 'REACT_DEV_2024_001.pdf'
        },
        {
          id: 4,
          examTitle: 'Database Management',
          subject: 'Database',
          teacher: 'Dr. Emily Davis',
          score: 88,
          totalQuestions: 20,
          correctAnswers: 17,
          incorrectAnswers: 3,
          timeTaken: 60,
          submittedAt: '2024-01-05T09:45:00',
          status: 'completed',
          rank: 2,
          totalStudents: 42,
          averageScore: 79,
          certificate: 'DB_MGMT_2024_001.pdf'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const performanceData = results.map(result => ({
    exam: result.examTitle.split(' ')[0],
    score: result.score,
    average: result.averageScore
  }));

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score, average) => {
    if (score > average) return <FiTrendingUp className="h-4 w-4 text-green-500" />;
    if (score < average) return <FiTrendingDown className="h-4 w-4 text-red-500" />;
    return <FiCheckCircle className="h-4 w-4 text-blue-500" />;
  };

  const downloadCertificate = (certificate) => {
    // Simulate certificate download
    const link = document.createElement('a');
    link.href = `#${certificate}`;
    link.download = certificate;
    link.click();
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Exam History</h1>
          <p className="text-gray-600 mt-2">View your past exam results and performance analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBarChart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiCheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Rank</p>
                <p className="text-2xl font-bold text-gray-900">
                  #{Math.min(...results.map(r => r.rank))}
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
                <p className="text-sm font-medium text-gray-600">Avg Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(results.reduce((sum, result) => sum + result.timeTaken, 0) / results.length)}m
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exam" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Your Score" />
                  <Line type="monotone" dataKey="average" stroke="#10b981" strokeWidth={2} name="Class Average" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exams Above Average</span>
                <span className="font-medium">
                  {results.filter(r => r.score > r.averageScore).length}/{results.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">90%+ Scores</span>
                <span className="font-medium">
                  {results.filter(r => r.score >= 90).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Top 3 Ranks</span>
                <span className="font-medium">
                  {results.filter(r => r.rank <= 3).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Certificates Earned</span>
                <span className="font-medium">{results.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Exam Results</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{result.examTitle}</div>
                        <div className="text-sm text-gray-500">{result.subject} • {result.teacher}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {result.totalQuestions} questions • {result.timeTaken} min
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </span>
                        {getScoreIcon(result.score, result.averageScore)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.correctAnswers}/{result.totalQuestions} correct
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">#{result.rank}</div>
                      <div className="text-xs text-gray-500">of {result.totalStudents}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Class avg: {result.averageScore}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.submittedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedResult(result)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadCertificate(result.certificate)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FiDownload className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Result Modal */}
        {selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Exam Result Details</h3>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedResult.examTitle}</h4>
                  <p className="text-sm text-gray-600">{selectedResult.subject} • {selectedResult.teacher}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary-600">{selectedResult.score}%</div>
                    <div className="text-sm text-gray-600">Your Score</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-600">#{selectedResult.rank}</div>
                    <div className="text-sm text-gray-600">Class Rank</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correct Answers:</span>
                    <span className="font-medium">{selectedResult.correctAnswers}/{selectedResult.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="font-medium">{selectedResult.timeTaken} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class Average:</span>
                    <span className="font-medium">{selectedResult.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">
                      {new Date(selectedResult.submittedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => downloadCertificate(selectedResult.certificate)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                  >
                    <FiDownload className="h-4 w-4 mr-2" />
                    Download Certificate
                  </button>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamHistory;
