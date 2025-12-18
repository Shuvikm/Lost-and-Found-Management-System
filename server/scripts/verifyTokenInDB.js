// Test and verify JWT token storage in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const User = require('../models/UserSchema');

const makeRequest = (method, path, data, token) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(postData);
    req.end();
  });
};

async function verifyTokenInDB() {
  const mongoURI = process.env.mongoURI || process.env.MONGO_URI;
  
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');
    
    // Create unique test user
    const timestamp = Date.now();
    const testEmail = `verify_${timestamp}@example.com`;
    const testRollNo = `VER${timestamp}`;
    
    console.log('1. Creating new user via signup...');
    const signupResult = await makeRequest('POST', '/signup', {
      username: 'Verify Token User',
      rollno: testRollNo,
      email: testEmail,
      password: 'testpass123'
    });
    
    if (signupResult.status !== 201) {
      console.log('   Signup failed:', signupResult.data);
      return;
    }
    
    console.log('   ✅ User created successfully');
    console.log('   Token from API:', signupResult.data.token.substring(0, 50) + '...');
    
    // Check MongoDB directly
    console.log('\n2. Checking MongoDB for stored JWT token...');
    const userInDB = await User.findOne({ email: testEmail }).select('+jwtToken +tokenExpiry +lastLogin');
    
    if (userInDB) {
      console.log('   ✅ User found in MongoDB:');
      console.log('   Username:', userInDB.username);
      console.log('   Email:', userInDB.email);
      console.log('   JWT Token stored:', userInDB.jwtToken ? userInDB.jwtToken.substring(0, 50) + '...' : 'NULL');
      console.log('   Token Expiry:', userInDB.tokenExpiry);
      console.log('   Last Login:', userInDB.lastLogin);
      
      // Verify token matches
      if (userInDB.jwtToken === signupResult.data.token) {
        console.log('\n   ✅ JWT Token in MongoDB matches API response!');
      } else {
        console.log('\n   ⚠️ Token mismatch or not stored');
      }
    } else {
      console.log('   ❌ User not found in MongoDB');
    }
    
    // Test login creates new token
    console.log('\n3. Testing login to see token update...');
    const loginResult = await makeRequest('POST', '/login', {
      email: testEmail,
      password: 'testpass123'
    });
    
    if (loginResult.status === 200) {
      console.log('   ✅ Login successful');
      console.log('   New Token:', loginResult.data.token.substring(0, 50) + '...');
      
      // Check MongoDB for updated token
      const updatedUser = await User.findOne({ email: testEmail });
      console.log('   DB Token Updated:', updatedUser.jwtToken ? updatedUser.jwtToken.substring(0, 50) + '...' : 'NULL');
      
      if (updatedUser.jwtToken === loginResult.data.token) {
        console.log('   ✅ Token properly updated in MongoDB on login!');
      }
    }
    
    // Test logout clears token
    console.log('\n4. Testing logout clears token from DB...');
    await makeRequest('GET', '/logout', null, loginResult.data.token);
    
    const loggedOutUser = await User.findOne({ email: testEmail });
    if (!loggedOutUser.jwtToken) {
      console.log('   ✅ Token properly cleared from MongoDB on logout!');
    } else {
      console.log('   ⚠️ Token still present after logout');
    }
    
    console.log('\n=== JWT Token MongoDB Storage Verification Complete! ===');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

verifyTokenInDB();
