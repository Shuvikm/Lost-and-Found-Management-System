const http = require('http');

const data = JSON.stringify({
  email: 'mshuvik@gmail.com', 
  password: '123456'
});

const options = {
  hostname: 'localhost', 
  port: 5000, 
  path: '/login', 
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json', 
    'Content-Length': data.length
  }
};

console.log('Sending login request to http://localhost:5000/login');
console.log('Data:', data);

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Error code:', e.code);
  console.error('Error message:', e.message);
});

req.write(data);
req.end();
