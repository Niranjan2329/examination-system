@echo off
chcp 65001 >nul

echo 🚀 Online Examination System - Installation Script
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed. Please install MySQL v8.0 or higher.
    echo Download from: https://dev.mysql.com/downloads/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ⚠️  Please edit the .env file with your configuration before continuing.
    echo    You need to set your MySQL password and other settings.
    pause
)

REM Setup database
echo 🗄️  Setting up database...
call npm run setup-db

if %errorlevel% neq 0 (
    echo ❌ Database setup failed. Please check your MySQL configuration.
    pause
    exit /b 1
)

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start the backend server: npm run dev
echo 2. Start the frontend (in a new terminal): cd client ^&^& npm start
echo 3. Open http://localhost:3000 in your browser
echo.
echo 👥 Demo accounts:
echo Teacher: sarah.johnson@university.edu / password123
echo Student: john.smith@student.edu / password123
echo.
echo 📚 For more information, see SETUP.md
pause 