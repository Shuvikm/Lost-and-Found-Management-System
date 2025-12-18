// Test authentication endpoints
const http = require('http');

const makeRequest = (method, path, data) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
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

async function testAuth() {
  console.log('=== Testing Authentication System ===\n');

  // Test 1: Signup
  console.log('1. Testing Signup...');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testRollNo = `ROLL${Date.now()}`;
  
  try {
    const signupResult = await makeRequest('POST', '/signup', {
      username: 'Test User',
      rollno: testRollNo,
      email: testEmail,
      password: 'password123'
    });
    
    console.log('   Status:', signupResult.status);
    console.log('   Response:', JSON.stringify(signupResult.data, null, 2));
    
    if (signupResult.data.token) {
      console.log('   ✅ JWT Token received on signup!');
      
      // Test 2: Login
      console.log('\n2. Testing Login...');
      const loginResult = await makeRequest('POST', '/login', {
        email: testEmail,
        password: 'password123'
      });
      
      console.log('   Status:', loginResult.status);
      console.log('   Response:', JSON.stringify(loginResult.data, null, 2));
      
      if (loginResult.data.token) {
        console.log('   ✅ JWT Token received on login!');
        
        // Test 3: Check Auth (protected route)
        console.log('\n3. Testing Protected Route (/check-auth)...');
        const checkAuthResult = await new Promise((resolve, reject) => {
          const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/check-auth',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginResult.data.token}`
            }
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
          req.end();
        });
        
        console.log('   Status:', checkAuthResult.status);
        console.log('   Response:', JSON.stringify(checkAuthResult.data, null, 2));
        
        if (checkAuthResult.status === 200) {
          console.log('   ✅ Protected route accessible with JWT token!');
        }
        
        // Test 4: Logout
        console.log('\n4. Testing Logout...');
        const logoutResult = await new Promise((resolve, reject) => {
          const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/logout',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginResult.data.token}`
            }
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
          req.end();
        });
        
        console.log('   Status:', logoutResult.status);
        console.log('   Response:', JSON.stringify(logoutResult.data, null, 2));
        
        if (logoutResult.status === 200) {
          console.log('   ✅ Logout successful!');
        }
      }
    }
    
    console.log('\n=== All Authentication Tests Completed! ===');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuth();
