#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo "✅ Git repository initialized"
else
    echo "📁 Git repository already exists"
fi

# Build the frontend
echo "🔨 Building frontend..."
cd client
npm run build
cd ..

echo "✅ Frontend build completed"

echo ""
echo "🎯 Deployment Options:"
echo "1. Vercel + Railway (Recommended)"
echo "2. Heroku"
echo "3. AWS"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🔧 Quick Steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy backend to Railway"
echo "3. Deploy frontend to Vercel"
echo "4. Set environment variables"
echo "5. Test your application"
echo ""
echo "🎉 Happy deploying!" 