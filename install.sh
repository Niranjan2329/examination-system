#!/bin/bash

# Online Examination System - Installation Script
# This script will help you set up the project quickly

echo "🚀 Online Examination System - Installation Script"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL v8.0 or higher."
    echo "Download from: https://dev.mysql.com/downloads/"
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit the .env file with your configuration before continuing."
    echo "   You need to set your MySQL password and other settings."
    read -p "Press Enter when you've updated the .env file..."
fi

# Setup database
echo "🗄️  Setting up database..."
npm run setup-db

if [ $? -ne 0 ]; then
    echo "❌ Database setup failed. Please check your MySQL configuration."
    exit 1
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server: npm run dev"
echo "2. Start the frontend (in a new terminal): cd client && npm start"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "👥 Demo accounts:"
echo "Teacher: sarah.johnson@university.edu / password123"
echo "Student: john.smith@student.edu / password123"
echo ""
echo "📚 For more information, see SETUP.md" 