import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiClock, 
  FiAlertTriangle,
  FiPlay
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading exam data
    setTimeout(() => {
      setExam({
        id: examId,
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
        duration: 60,
        totalQuestions: 5,
        instructions: 'Read each question carefully. You can navigate between questions using the question navigator. Submit your exam when you are finished.'
      });

      setQuestions([
        {
          id: 1,
          question: 'What is the primary purpose of JavaScript in web development?',
          options: [
            'To style web pages',
            'To add interactivity and dynamic behavior',
            'To structure web content',
            'To optimize images'
          ],
          points: 1
        },
        {
          id: 2,
          question: 'Which of the following is NOT a JavaScript data type?',
          options: [
            'String',
            'Boolean',
            'Integer',
            'Undefined'
          ],
          points: 1
        },
        {
          id: 3,
          question: 'What does the "DOM" stand for in web development?',
          options: [
            'Document Object Model',
            'Data Object Management',
            'Dynamic Object Method',
            'Document Order Model'
          ],
          points: 1
        },
        {
          id: 4,
          question: 'Which method is used to add an element to the end of an array?',
          options: [
            'push()',
            'pop()',
            'shift()',
            'unshift()'
          ],
          points: 1
        },
        {
          id: 5,
          question: 'What is the correct way to declare a variable in JavaScript?',
          options: [
            'var myVariable;',
            'variable myVariable;',
            'v myVariable;',
            'declare myVariable;'
          ],
          points: 1
        }
      ]);

      setTimeLeft(60 * 60); // 60 minutes in seconds
      setLoading(false);
    }, 1000);
  }, [examId]);

  const handleAutoSubmit = useCallback(() => {
    setIsSubmitted(true);
    toast.error('Time is up! Your exam has been automatically submitted.');
    
    setTimeout(() => {
      navigate('/student/history');
    }, 2000);
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, isSubmitted, handleAutoSubmit]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setIsStarted(true);
    toast.success('Exam started! Good luck!');
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = () => {
    const answeredQuestions = Object.keys(answers).length;
    const totalQuestions = questions.length;
    
    if (answeredQuestions < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredQuestions} out of ${totalQuestions} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitted(true);
    toast.success('Exam submitted successfully!');
    
    // Simulate processing
    setTimeout(() => {
      navigate('/student/history');
    }, 2000);
  };

  const getQuestionStatus = (index) => {
    const questionId = questions[index]?.id;
    if (answers[questionId] !== undefined) {
      return 'answered';
    }
    return 'unanswered';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Exam not found</p>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{exam.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{exam.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Points:</span>
                    <span className="font-medium">{questions.reduce((sum, q) => sum + q.points, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Read each question carefully before answering</p>
                  <p>• You can navigate between questions using the navigator</p>
                  <p>• You can review and change your answers before submitting</p>
                  <p>• The exam will auto-submit when time runs out</p>
                  <p>• Ensure you have a stable internet connection</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartExam}
                className="flex items-center mx-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <FiPlay className="h-5 w-5 mr-2" />
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
                <FiClock className="h-5 w-5 text-red-600" />
                <span className="font-mono text-lg font-semibold text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitted}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentQuestion === index
                        ? 'bg-primary-600 text-white'
                        : getQuestionStatus(index) === 'answered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-primary-600 rounded mr-2"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              {questions[currentQuestion] && (
                <>
                  <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Question {currentQuestion + 1}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {questions[currentQuestion].points} point{questions[currentQuestion].points > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-lg text-gray-700 mb-6">
                      {questions[currentQuestion].question}
                    </p>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                            answers[questions[currentQuestion].id] === index
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${questions[currentQuestion].id}`}
                            value={index}
                            checked={answers[questions[currentQuestion].id] === index}
                            onChange={() => handleAnswerChange(questions[currentQuestion].id, index)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <span className="ml-3 text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestion === 0}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {Object.keys(answers).length} of {questions.length} answered
                      </span>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      disabled={currentQuestion === questions.length - 1}
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Exam</h3>
            <p className="text-gray-600">Please wait while we calculate your results...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
