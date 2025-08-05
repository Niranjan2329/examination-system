import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  FiSave, 
  FiPlus, 
  FiTrash2, 
  FiZap,
  FiBookOpen
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateExam = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [questions, setQuestions] = useState([]);


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();



  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const generateAIQuestions = async () => {
    setIsGeneratingAI(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiQuestions = [
        {
          id: Date.now(),
          question: 'What is the primary purpose of JavaScript in web development?',
          options: [
            'To style web pages',
            'To add interactivity and dynamic behavior',
            'To structure web content',
            'To optimize images'
          ],
          correctAnswer: 1,
          points: 1
        },
        {
          id: Date.now() + 1,
          question: 'Which of the following is NOT a JavaScript data type?',
          options: [
            'String',
            'Boolean',
            'Integer',
            'Undefined'
          ],
          correctAnswer: 2,
          points: 1
        },
        {
          id: Date.now() + 2,
          question: 'What does the "DOM" stand for in web development?',
          options: [
            'Document Object Model',
            'Data Object Management',
            'Dynamic Object Method',
            'Document Order Model'
          ],
          correctAnswer: 0,
          points: 1
        }
      ];
      
      setQuestions(aiQuestions);
      toast.success('AI questions generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI questions');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const onSubmit = async (data) => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const examData = {
        ...data,
        questions,
        totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
        totalQuestions: questions.length
      };
      
      console.log('Exam data:', examData);
      toast.success('Exam created successfully!');
      navigate('/teacher/exams');
    } catch (error) {
      toast.error('Failed to create exam');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600 mt-2">Design and configure your examination</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Exam Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Exam Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Exam title is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter exam title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., JavaScript, React, Database"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  {...register('duration', { 
                    required: 'Duration is required',
                    min: { value: 1, message: 'Duration must be at least 1 minute' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="60"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  {...register('passingScore', { 
                    min: { value: 0, message: 'Passing score must be 0 or higher' },
                    max: { value: 100, message: 'Passing score cannot exceed 100' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="70"
                />
                {errors.passingScore && (
                  <p className="text-red-500 text-sm mt-1">{errors.passingScore.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter exam description..."
              />
            </div>
          </div>

          {/* Exam Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Exam Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register('startDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register('endDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('shuffleQuestions')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Shuffle questions for each student
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('showResults')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Show results immediately after completion
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('allowRetake')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Allow students to retake the exam
                </label>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={generateAIQuestions}
                  disabled={isGeneratingAI}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50"
                >
                  <FiZap className="h-4 w-4 mr-2" />
                  {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                </button>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add Question
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <FiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No questions added yet. Add questions manually or generate them with AI.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter your question..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points
                        </label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                          min="1"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {questions.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Questions: {questions.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    Total Points: {questions.reduce((sum, q) => sum + q.points, 0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/teacher/exams')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
            >
              <FiSave className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
