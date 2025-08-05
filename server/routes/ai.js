const express = require('express');
const OpenAI = require('openai');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireTeacher } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate exam questions using AI
router.post('/generate-exam', authenticateToken, requireTeacher, [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('questionCount').isInt({ min: 5, max: 50 }).withMessage('Question count must be between 5 and 50'),
  body('questionTypes').isArray().withMessage('Question types must be an array'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, topic, difficulty, questionCount, questionTypes, duration } = req.body;

    // Create prompt for AI
    const prompt = createExamPrompt(subject, topic, difficulty, questionCount, questionTypes);

    // Generate exam using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator. Generate exam questions in JSON format with the following structure: { questions: [{ question_text: string, question_type: string, options: array (for multiple choice), correct_answer: string, marks: number }] }"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Parse AI response
    let examData;
    try {
      examData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('AI response parsing error:', parseError);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    // Validate exam data structure
    if (!examData.questions || !Array.isArray(examData.questions)) {
      return res.status(500).json({ error: 'Invalid exam data structure from AI' });
    }

    // Calculate total marks
    const totalMarks = examData.questions.reduce((sum, question) => sum + question.marks, 0);
    const passingMarks = Math.ceil(totalMarks * 0.4); // 40% passing criteria

    res.json({
      message: 'Exam generated successfully',
      exam: {
        title: `${subject} - ${topic} Exam`,
        description: `AI-generated exam on ${topic} for ${subject}`,
        subject,
        topic,
        difficulty,
        duration,
        total_marks: totalMarks,
        passing_marks: passingMarks,
        questions: examData.questions
      }
    });

  } catch (error) {
    console.error('AI exam generation error:', error);
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ error: 'AI service quota exceeded. Please try again later.' });
    }
    res.status(500).json({ error: 'Failed to generate exam' });
  }
});

// Generate question suggestions
router.post('/suggest-questions', authenticateToken, requireTeacher, [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, topic, difficulty } = req.body;

    const prompt = `Suggest 5 different question types for a ${difficulty} level ${subject} exam on ${topic}. 
    For each suggestion, provide:
    1. Question type (multiple_choice, true_false, short_answer, essay)
    2. Sample question
    3. Why this question type would be effective for this topic
    
    Format as JSON array with objects containing: type, sample_question, reasoning`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an educational expert providing question suggestions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0].message.content;
    
    let suggestions;
    try {
      suggestions = JSON.parse(aiResponse);
    } catch (parseError) {
      return res.status(500).json({ error: 'Failed to parse AI suggestions' });
    }

    res.json({
      message: 'Question suggestions generated',
      suggestions
    });

  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Analyze exam difficulty
router.post('/analyze-difficulty', authenticateToken, requireTeacher, [
  body('questions').isArray().withMessage('Questions must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questions } = req.body;

    const prompt = `Analyze the following exam questions and provide:
    1. Overall difficulty level (easy/medium/hard)
    2. Difficulty distribution across questions
    3. Suggestions for improvement
    4. Estimated completion time
    
    Questions: ${JSON.stringify(questions)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an educational assessment expert."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 800
    });

    const analysis = completion.choices[0].message.content;

    res.json({
      message: 'Difficulty analysis completed',
      analysis
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze difficulty' });
  }
});

// Helper function to create exam prompt
function createExamPrompt(subject, topic, difficulty, questionCount, questionTypes) {
  const difficultyMap = {
    easy: 'basic concepts and fundamental knowledge',
    medium: 'intermediate understanding and application',
    hard: 'advanced concepts, analysis, and synthesis'
  };

  const typeMap = {
    multiple_choice: 'multiple choice questions with 4 options',
    true_false: 'true/false questions',
    short_answer: 'short answer questions requiring brief explanations',
    essay: 'essay questions requiring detailed responses'
  };

  const questionTypeDescriptions = questionTypes.map(type => typeMap[type] || type).join(', ');

  return `Create a comprehensive ${difficulty} level exam for ${subject} on the topic: ${topic}.

Requirements:
- Total questions: ${questionCount}
- Question types: ${questionTypeDescriptions}
- Difficulty level: ${difficultyMap[difficulty]}
- Each question should test ${difficultyMap[difficulty]}
- Include a mix of question types as specified
- For multiple choice questions, provide 4 options (A, B, C, D)
- Assign appropriate marks to each question (1-5 marks per question)
- Ensure questions are clear, unambiguous, and educationally sound

Please generate the exam in the specified JSON format with questions array containing question_text, question_type, options (for multiple choice), correct_answer, and marks for each question.`;
}

module.exports = router; 