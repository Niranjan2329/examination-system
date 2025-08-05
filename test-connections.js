#!/usr/bin/env node

/**
 * Test Script for External Connections
 * This script tests all external connections in your Online Examination System
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const axios = require('axios');
const { testEmailConfig } = require('./server/utils/emailService');

console.log('🔍 Testing External Connections...\n');

// Test database connection
async function testDatabase() {
  console.log('📊 Testing Database Connection...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'examination_system',
    });

    const [rows] = await connection.execute('SELECT 1 as test');
    await connection.end();
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  }
}

// Test API server
async function testAPIServer() {
  console.log('\n🌐 Testing API Server...');
  try {
    const response = await axios.get('http://localhost:5000/api/health', {
      timeout: 5000
    });
    
    if (response.data.status === 'OK') {
      console.log('✅ API server is running');
      return true;
    } else {
      console.log('❌ API server returned unexpected response');
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ API server is not running. Start it with: npm start');
    } else {
      console.log('❌ API server error:', error.message);
    }
    return false;
  }
}

// Test OpenAI API
async function testOpenAI() {
  console.log('\n🤖 Testing OpenAI API...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  OpenAI API key not found in .env file');
    console.log('   Add OPENAI_API_KEY=your_key_here to your .env file');
    return false;
  }

  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.models.list();
    console.log('✅ OpenAI API connection successful');
    return true;
  } catch (error) {
    if (error.message.includes('Invalid API key')) {
      console.log('❌ Invalid OpenAI API key');
      console.log('   Please check your OPENAI_API_KEY in .env file');
    } else {
      console.log('❌ OpenAI API error:', error.message);
    }
    return false;
  }
}

// Test email configuration
async function testEmail() {
  console.log('\n📧 Testing Email Configuration...');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email credentials not found in .env file');
    console.log('   Add EMAIL_USER and EMAIL_PASS to your .env file');
    return false;
  }

  try {
    const result = await testEmailConfig();
    if (result.success) {
      console.log('✅ Email configuration is valid');
      return true;
    } else {
      console.log('❌ Email configuration error:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Email test error:', error.message);
    return false;
  }
}

// Test frontend proxy
async function testFrontendProxy() {
  console.log('\n🎨 Testing Frontend Proxy...');
  try {
    const response = await axios.get('http://localhost:3000', {
      timeout: 5000
    });
    
    if (response.status === 200) {
      console.log('✅ Frontend server is running');
      return true;
    } else {
      console.log('❌ Frontend server returned unexpected status');
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Frontend server is not running. Start it with: cd client && npm start');
    } else {
      console.log('❌ Frontend server error:', error.message);
    }
    return false;
  }
}

// Test environment variables
function testEnvironmentVariables() {
  console.log('\n⚙️  Testing Environment Variables...');
  
  const requiredVars = [
    'DB_HOST',
    'DB_USER', 
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET'
  ];

  const optionalVars = [
    'OPENAI_API_KEY',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];

  let allRequiredPresent = true;
  let optionalCount = 0;

  console.log('Required variables:');
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName} is set`);
    } else {
      console.log(`  ❌ ${varName} is missing`);
      allRequiredPresent = false;
    }
  });

  console.log('\nOptional variables:');
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName} is set`);
      optionalCount++;
    } else {
      console.log(`  ⚠️  ${varName} is not set (optional)`);
    }
  });

  return { allRequiredPresent, optionalCount };
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting External Connections Test Suite\n');
  
  const results = {
    database: false,
    apiServer: false,
    openai: false,
    email: false,
    frontend: false,
    envVars: { allRequiredPresent: false, optionalCount: 0 }
  };

  // Test environment variables first
  results.envVars = testEnvironmentVariables();

  // Test database
  results.database = await testDatabase();

  // Test API server
  results.apiServer = await testAPIServer();

  // Test OpenAI
  results.openai = await testOpenAI();

  // Test email
  results.email = await testEmail();

  // Test frontend
  results.frontend = await testFrontendProxy();

  // Summary
  console.log('\n📋 Test Summary:');
  console.log('================');
  console.log(`Database: ${results.database ? '✅' : '❌'}`);
  console.log(`API Server: ${results.apiServer ? '✅' : '❌'}`);
  console.log(`OpenAI API: ${results.openai ? '✅' : '❌'}`);
  console.log(`Email Config: ${results.email ? '✅' : '❌'}`);
  console.log(`Frontend: ${results.frontend ? '✅' : '❌'}`);
  console.log(`Environment Variables: ${results.envVars.allRequiredPresent ? '✅' : '❌'}`);

  const passedTests = Object.values(results).filter(r => r === true).length;
  const totalTests = 5; // Excluding envVars object

  console.log(`\n🎯 Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your external connections are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above and fix them.');
    console.log('\n💡 Quick fixes:');
    
    if (!results.database) {
      console.log('  - Make sure MySQL is running and credentials are correct in .env');
    }
    
    if (!results.apiServer) {
      console.log('  - Start the backend server: npm start');
    }
    
    if (!results.frontend) {
      console.log('  - Start the frontend server: cd client && npm start');
    }
    
    if (!results.openai) {
      console.log('  - Get an OpenAI API key and add it to .env');
    }
    
    if (!results.email) {
      console.log('  - Configure email credentials in .env (optional)');
    }
  }

  console.log('\n📚 For detailed setup instructions, see:');
  console.log('  - EXTERNAL_CONNECTIONS.md');
  console.log('  - SETUP.md');
  console.log('  - README.md');
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testDatabase,
  testAPIServer,
  testOpenAI,
  testEmail,
  testFrontendProxy,
  testEnvironmentVariables,
  runAllTests
}; 