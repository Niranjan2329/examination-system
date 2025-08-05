# Online Examination System - Setup Guide

## 🚀 Quick Start

This guide will help you set up the Online Examination System on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd online-examination-system
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=examination_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# OpenAI Configuration (Optional - for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (Optional - for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Security Configuration
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Setup

#### Option A: Using the Setup Script (Recommended)

```bash
# Run the database setup script
npm run setup-db
```

This will:
- Create the database
- Create all necessary tables
- Insert sample data (teachers, students, exams)

#### Option B: Manual Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE examination_system;
```

2. Run the setup script:
```bash
node database/setup.js
```

### 5. Start the Application

#### Development Mode

```bash
# Start the backend server
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

#### Production Mode

```bash
# Build the frontend
cd client
npm run build
cd ..

# Start the production server
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 👥 Demo Accounts

The setup script creates demo accounts for testing:

### Teacher Account
- **Email**: sarah.johnson@university.edu
- **Password**: password123
- **Features**: Create exams, view results, manage students

### Student Account
- **Email**: john.smith@student.edu
- **Password**: password123
- **Features**: Take exams, view results, track performance

## 🔧 Configuration Options

### Database Configuration

You can modify the database settings in the `.env` file:

```env
DB_HOST=localhost          # Database host
DB_USER=root              # Database username
DB_PASSWORD=your_password # Database password
DB_NAME=examination_system # Database name
```

### AI Integration (Optional)

To enable AI-powered exam generation:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Email Notifications (Optional)

To enable email notifications:

1. Configure your email settings in `.env`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## 📁 Project Structure

```
online-examination-system/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── database/            # Database scripts
├── uploads/             # File uploads
├── .env                 # Environment variables
├── package.json         # Backend dependencies
└── README.md           # Project documentation
```

## 🚀 Deployment

### Heroku Deployment

1. Create a Heroku account and install Heroku CLI
2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Add MySQL addon:
```bash
heroku addons:create cleardb:ignite
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
```

5. Deploy:
```bash
git push heroku main
```

### Vercel Deployment (Frontend)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from the client directory:
```bash
cd client
vercel
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `ER_ACCESS_DENIED_ERROR`

**Solution**: Check your MySQL credentials in the `.env` file and ensure the user has proper permissions.

#### 2. Port Already in Use

**Error**: `EADDRINUSE`

**Solution**: Change the port in `.env` or kill the process using the port:
```bash
# Find the process
lsof -i :5000

# Kill the process
kill -9 <PID>
```

#### 3. Frontend Build Error

**Error**: Build fails with dependency issues

**Solution**: Clear node_modules and reinstall:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

#### 4. AI Features Not Working

**Error**: OpenAI API errors

**Solution**: 
- Check if your OpenAI API key is valid
- Ensure you have sufficient credits
- Verify the API key is correctly set in `.env`

### Getting Help

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the database connection
5. Review the API documentation

## 📚 API Documentation

The API documentation is available at:
- **Swagger UI**: http://localhost:5000/api-docs (if enabled)
- **Health Check**: http://localhost:5000/api/health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Happy Coding! 🎉** 