# External Connections Guide - Online Examination System

## 🔗 What are External Connections?

External connections refer to how different parts of your application communicate with each other and with external services. In your Online Examination System, there are several key connections that need to be properly configured.

## 📋 Types of External Connections

### 1. Frontend to Backend (React ↔ Node.js API)

**What it is:** How your React application (running in the browser) communicates with your Node.js server.

**How it's configured:**

#### Client-side (React):
```javascript
// client/src/context/AuthContext.js
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

#### Proxy Configuration:
```json
// client/package.json
{
  "proxy": "http://localhost:5000"
}
```

#### Server-side (Node.js):
```javascript
// server.js
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/exams', require('./server/routes/exams'));
app.use('/api/results', require('./server/routes/results'));
// ... other routes
```

**How to set it up:**
1. **Development:** Already configured! The proxy in `client/package.json` automatically forwards API requests to your backend.
2. **Production:** Update `CORS_ORIGIN` in your `.env` file to match your deployed frontend URL.

### 2. Backend to Database (Node.js ↔ MySQL)

**What it is:** How your Node.js server connects to and interacts with your MySQL database.

**How it's configured:**

#### Environment Variables:
```env
# .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=examination_system
```

#### Database Configuration:
```javascript
// server/config/database.js
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'examination_system',
  // ... other settings
};

const pool = mysql.createPool(dbConfig);
```

**How to set it up:**
1. **Install MySQL** on your machine
2. **Create the database:**
   ```bash
   npm run setup-db
   ```
3. **Update `.env`** with your MySQL credentials
4. **Test connection:**
   ```bash
   npm start
   ```
   You should see: `✅ Database connected successfully`

### 3. Backend to AI Service (Node.js ↔ OpenAI)

**What it is:** How your Node.js server communicates with OpenAI's API to generate exam questions.

**How it's configured:**

#### Environment Variable:
```env
# .env
OPENAI_API_KEY=your_openai_api_key_here
```

#### AI Service Configuration:
```javascript
// server/routes/ai.js
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

**How to set it up:**
1. **Get OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an account and get your API key
2. **Add to `.env`:**
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. **Test AI features** in your application

### 4. Backend to Email Service (Node.js ↔ SMTP)

**What it is:** How your Node.js server sends email notifications to users.

**How it's configured:**

#### Environment Variables:
```env
# .env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

#### Email Service Setup (Example):
```javascript
// server/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
```

**How to set it up:**
1. **For Gmail:**
   - Enable 2-factor authentication
   - Generate an "App Password"
   - Use the app password in `EMAIL_PASS`
2. **For other services:** Check their SMTP documentation
3. **Add credentials to `.env`**
4. **Implement email sending logic** in your notification routes

### 5. Deployment (Local ↔ Internet)

**What it is:** Making your application accessible to users over the internet.

**How it's configured:**

#### Environment Variables for Production:
```env
# Production .env
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
```

#### CORS Configuration:
```javascript
// server.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

**How to set it up:**
1. **Choose hosting platforms:**
   - **Frontend:** Vercel, Netlify, or GitHub Pages
   - **Backend:** Heroku, Railway, Render, or AWS
   - **Database:** AWS RDS, Google Cloud SQL, or PlanetScale
2. **Set environment variables** on your hosting platform
3. **Deploy your application**

## 🛠️ Step-by-Step Setup Instructions

### Step 1: Local Development Setup

1. **Clone and install:**
   ```bash
   git clone <your-repo>
   cd online-examination-system
   npm install
   cd client && npm install && cd ..
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

3. **Set up database:**
   ```bash
   npm run setup-db
   ```

4. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   npm start
   
   # Terminal 2 - Frontend
   cd client && npm start
   ```

### Step 2: External Services Setup

1. **MySQL Database:**
   - Install MySQL on your machine
   - Create a user or use root
   - Update `DB_PASSWORD` in `.env`

2. **OpenAI API:**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Get your API key
   - Add to `OPENAI_API_KEY` in `.env`

3. **Email Service (Optional):**
   - Set up Gmail app password
   - Add credentials to `.env`
   - Implement email sending logic

### Step 3: Production Deployment

1. **Frontend Deployment (Vercel):**
   ```bash
   cd client
   npm run build
   vercel
   ```

2. **Backend Deployment (Heroku):**
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   git push heroku main
   ```

3. **Database Deployment:**
   - Use a managed database service
   - Update `DB_HOST` in production environment

## 🔧 Configuration Files

### Environment Variables (.env)
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
JWT_SECRET=your_super_secret_jwt_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Security Configuration
CORS_ORIGIN=http://localhost:3000
```

### Client Configuration
```json
// client/package.json
{
  "proxy": "http://localhost:5000"
}
```

```javascript
// client/src/context/AuthContext.js
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## 🚨 Common Issues and Solutions

### 1. Database Connection Error
**Error:** `ER_ACCESS_DENIED_ERROR`
**Solution:** Check MySQL credentials in `.env`

### 2. CORS Error
**Error:** `Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy`
**Solution:** Ensure CORS is properly configured in `server.js`

### 3. OpenAI API Error
**Error:** `Invalid API key`
**Solution:** Check your `OPENAI_API_KEY` in `.env`

### 4. Port Already in Use
**Error:** `EADDRINUSE`
**Solution:** Change port in `.env` or kill existing process

## 📊 Connection Flow Diagram

```
┌─────────────┐    HTTP/HTTPS    ┌─────────────┐    TCP/IP     ┌─────────────┐
│   React     │ ────────────────► │   Node.js   │ ─────────────► │   MySQL     │
│  Frontend   │                  │   Backend   │               │  Database   │
└─────────────┘                  └─────────────┘               └─────────────┘
       │                                │                              │
       │                                │                              │
       ▼                                ▼                              ▼
┌─────────────┐                  ┌─────────────┐              ┌─────────────┐
│   Browser   │                  │   OpenAI    │              │   File      │
│   Storage   │                  │     API     │              │   System    │
└─────────────┘                  └─────────────┘              └─────────────┘
```

## 🎯 Testing Your Connections

### 1. Test Database Connection
```bash
npm run setup-db
# Should show: ✅ Database connected successfully
```

### 2. Test API Connection
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"Online Examination System is running"}
```

### 3. Test Frontend-Backend Connection
- Open `http://localhost:3000`
- Try to login with demo credentials
- Check browser network tab for API calls

### 4. Test AI Connection
- Create an exam using AI features
- Check console for OpenAI API responses

## 🔒 Security Considerations

1. **Environment Variables:** Never commit `.env` files to version control
2. **CORS:** Configure allowed origins properly for production
3. **Rate Limiting:** Already implemented in `server.js`
4. **JWT Secrets:** Use strong, random secrets
5. **Database Passwords:** Use strong passwords and limit database user permissions

## 📈 Scaling Considerations

1. **Database:** Use connection pooling (already implemented)
2. **API:** Implement caching for frequently accessed data
3. **File Uploads:** Use cloud storage (AWS S3, Google Cloud Storage)
4. **Load Balancing:** Use multiple server instances
5. **CDN:** Serve static assets through a CDN

This guide covers all the external connections in your Online Examination System. Each connection is essential for the proper functioning of your application, and proper configuration ensures security and performance. 