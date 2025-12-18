// Test authentication error handling
require('dotenv').config();
const http = require('http');

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

async function testErrorHandling() {
  console.log('=== Testing Authentication Error Handling ===\n');
  
  // Test 1: Login with wrong password
  console.log('1. Testing login with wrong password...');
  const wrongPasswordResult = await makeRequest('POST', '/login', {
    email: 'testuser_1766070847766@example.com',
    password: 'wrongpassword'
  });
  console.log('   Status:', wrongPasswordResult.status);
  console.log('   Response:', JSON.stringify(wrongPasswordResult.data));
  console.log(wrongPasswordResult.status === 401 ? '   ✅ Correctly returned 401' : '   ❌ Unexpected status');
  
  // Test 2: Login with non-existent email
  console.log('\n2. Testing login with non-existent email...');
  const nonExistentResult = await makeRequest('POST', '/login', {
    email: 'nonexistent@example.com',
    password: 'password123'
  });
  console.log('   Status:', nonExistentResult.status);
  console.log('   Response:', JSON.stringify(nonExistentResult.data));
  console.log(nonExistentResult.status === 401 ? '   ✅ Correctly returned 401' : '   ❌ Unexpected status');
  
  // Test 3: Protected route without token
  console.log('\n3. Testing protected route without token...');
  const noTokenResult = await makeRequest('GET', '/check-auth', null, null);
  console.log('   Status:', noTokenResult.status);
  console.log('   Response:', JSON.stringify(noTokenResult.data));
  console.log(noTokenResult.status === 401 ? '   ✅ Correctly returned 401' : '   ❌ Unexpected status');
  
  // Test 4: Protected route with invalid token
  console.log('\n4. Testing protected route with invalid token...');
  const invalidTokenResult = await makeRequest('GET', '/check-auth', null, 'invalid.token.here');
  console.log('   Status:', invalidTokenResult.status);
  console.log('   Response:', JSON.stringify(invalidTokenResult.data));
  console.log(invalidTokenResult.status === 401 ? '   ✅ Correctly returned 401' : '   ❌ Unexpected status');
  
  // Test 5: Signup with missing fields
  console.log('\n5. Testing signup with missing fields...');
  const missingFieldsResult = await makeRequest('POST', '/signup', {
    username: 'Test',
    email: 'incomplete@example.com'
  });
  console.log('   Status:', missingFieldsResult.status);
  console.log('   Response:', JSON.stringify(missingFieldsResult.data));
  console.log(missingFieldsResult.status === 400 ? '   ✅ Correctly returned 400' : '   ❌ Unexpected status');
  
  // Test 6: Signup with short password
  console.log('\n6. Testing signup with short password...');
  const shortPasswordResult = await makeRequest('POST', '/signup', {
    username: 'Test User',
    rollno: 'ROLL999',
    email: 'shortpass@example.com',
    password: '123'
  });
  console.log('   Status:', shortPasswordResult.status);
  console.log('   Response:', JSON.stringify(shortPasswordResult.data));
  console.log(shortPasswordResult.status === 400 ? '   ✅ Correctly returned 400' : '   ❌ Unexpected status');
  
  // Test 7: Login with missing email
  console.log('\n7. Testing login with missing password...');
  const missingPasswordResult = await makeRequest('POST', '/login', {
    email: 'test@example.com'
  });
  console.log('   Status:', missingPasswordResult.status);
  console.log('   Response:', JSON.stringify(missingPasswordResult.data));
  console.log(missingPasswordResult.status === 400 ? '   ✅ Correctly returned 400' : '   ❌ Unexpected status');
  
  console.log('\n=== Error Handling Tests Complete! ===');
}

testErrorHandling();
