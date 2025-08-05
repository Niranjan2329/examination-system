# Online Examination System

A comprehensive online examination system built with React, Node.js, and MySQL, featuring AI-powered exam generation and real-time analytics.

## 🚀 Features

### For Teachers
- **Profile Management**: Update profile information and upload profile pictures
- **AI-Powered Exam Creation**: Generate exams using ChatGPT integration
- **Exam Scheduling**: Create and schedule exams with specific time limits
- **Analytics Dashboard**: View student performance, results, and statistics
- **Exam History**: Track all created exams and their outcomes
- **Student Management**: Monitor student participation and progress

### For Students
- **Profile Management**: Update personal information and profile pictures
- **Exam Dashboard**: View upcoming and available exams
- **Real-time Results**: Get immediate feedback after exam completion
- **Performance Analytics**: Track progress with charts and rankings
- **Certificate Generation**: Download participation certificates
- **Notifications**: Receive alerts for upcoming exams

### Additional Features
- **AI Integration**: OpenAI ChatGPT for intelligent exam generation
- **Real-time Notifications**: Instant updates for exam schedules
- **Performance Tracking**: Detailed analytics and progress monitoring
- **Mobile Responsive**: Works seamlessly on all devices
- **Secure Authentication**: JWT-based secure login system

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Hook Form
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI Integration**: OpenAI API (ChatGPT)
- **Authentication**: JWT Tokens
- **File Upload**: Multer
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- OpenAI API Key

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-examination-system
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=examination_system
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

5. **Database Setup**
   ```bash
   npm run setup-db
   ```

6. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
online-examination-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── uploads/             # File uploads
└── database/            # Database scripts
```

## 🎯 Usage

1. **Teacher Registration/Login**
   - Register as a teacher
   - Access teacher dashboard
   - Create exams using AI assistance
   - Schedule and manage exams

2. **Student Registration/Login**
   - Register as a student
   - Access student dashboard
   - View available exams
   - Take exams and view results

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Teachers
- `POST /api/exams/create` - Create new exam
- `GET /api/exams/teacher/:id` - Get teacher's exams
- `GET /api/results/teacher/:id` - Get exam results

### Students
- `GET /api/exams/available` - Get available exams
- `POST /api/exams/submit` - Submit exam answers
- `GET /api/results/student/:id` - Get student results

## 🤖 AI Integration

The system uses OpenAI's ChatGPT API to:
- Generate exam questions automatically
- Create diverse question types
- Provide intelligent exam suggestions
- Assist in question difficulty adjustment

## 📊 Database Schema

The system includes tables for:
- Users (teachers and students)
- Exams and questions
- Student responses and results
- Notifications and certificates

## 🚀 Deployment

The application can be deployed to:
- Heroku
- Vercel (frontend)
- Railway
- AWS

## 📈 Future Enhancements

- Video proctoring integration
- Advanced analytics and reporting
- Multi-language support
- Integration with LMS platforms
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact:
- Email: your-email@example.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

**Built with ❤️ for educational excellence** 