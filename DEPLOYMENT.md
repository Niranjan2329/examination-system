# 🚀 Deployment Guide

This guide will help you deploy your Online Examination System to various platforms.

## 📋 Prerequisites

1. **GitHub Account** - For version control
2. **Vercel Account** - For frontend deployment (free)
3. **Railway Account** - For backend deployment (free tier available)
4. **Database** - MySQL database (Railway, PlanetScale, or AWS RDS)

## 🎯 Option 1: Vercel + Railway (Recommended)

### Step 1: Prepare Your Code

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/online-examination-system.git
   git push -u origin main
   ```

### Step 2: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Add Environment Variables:**
   ```
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   NODE_ENV=production
   PORT=5000
   ```
7. **Deploy** - Railway will automatically build and deploy

### Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `./client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. **Add Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-railway-app-url.railway.app/api
   ```
7. **Deploy**

## 🎯 Option 2: Heroku (Full Stack)

### Step 1: Install Heroku CLI

```bash
# Windows
winget install --id=Heroku.HerokuCLI

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-exam-system-app

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key
heroku config:set OPENAI_API_KEY=your-openai-api-key
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-email-app-password

# Deploy
git push heroku main

# Open app
heroku open
```

## 🎯 Option 3: AWS (Advanced)

### Step 1: AWS Setup

1. **Create AWS Account**
2. **Install AWS CLI**
3. **Configure AWS credentials**

### Step 2: Deploy Backend

1. **Create EC2 Instance**
2. **Install Node.js and MySQL**
3. **Deploy using PM2:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "exam-system"
   pm2 startup
   pm2 save
   ```

### Step 3: Deploy Frontend

1. **Use AWS S3 + CloudFront**
2. **Or deploy to EC2 with Nginx**

## 🔧 Environment Variables

### Required Variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=examination_system
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5000
```

### Optional Variables:
```
OPENAI_API_KEY=your-openai-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

## 🌐 Database Options

### 1. Railway MySQL (Recommended)
- Free tier available
- Easy setup
- Automatic backups

### 2. PlanetScale
- Serverless MySQL
- Free tier available
- Great performance

### 3. AWS RDS
- Fully managed
- Scalable
- Pay-as-you-go

### 4. ClearDB (Heroku)
- Heroku addon
- Easy integration
- Automatic scaling

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Node.js version
   - Verify all dependencies are in package.json

2. **Database Connection:**
   - Verify environment variables
   - Check database credentials
   - Ensure database is accessible

3. **CORS Errors:**
   - Update CORS configuration in server.js
   - Add your frontend URL to allowed origins

4. **Environment Variables:**
   - Double-check all variables are set
   - Restart the application after changes

## 📞 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify all environment variables are set
3. Test locally first
4. Check the platform's documentation

## 🎉 Success!

Once deployed, your application will be available at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-app.railway.app

Remember to:
- Test all features after deployment
- Set up monitoring and logging
- Configure custom domains if needed
- Set up SSL certificates 