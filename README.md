# Lost and Found Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing lost and found items with JWT authentication.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **JWT Token Storage**: Tokens stored in MongoDB for session management
- **Lost Items**: Report and track lost items
- **Found Items**: Report items you've found
- **Claims System**: Claim items and manage claim requests
- **Dashboard**: View and manage your items
- **Role-based Access**: User and Admin roles

## 🏗️ Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── utils/          # Redux store, API utilities
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── config/             # Database configuration
│   ├── middleware/         # AUTH & validation middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API controllers
│   ├── scripts/            # Test & seed scripts
│   ├── server.js           # Express server entry point
│   └── package.json
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Lost-and-Found-Management-System.git
   cd Lost-and-Found-Management-System
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables:**
   
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   mongoURI=mongodb+srv://your-username:your-password@cluster.mongodb.net/lostandfound
   SECRETKEY=your-jwt-secret-key
   ```

## 🚀 Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm start
   ```
   Frontend runs on `http://localhost:3000`

## 🔐 Authentication System

### JWT Token Flow

1. **Signup**: Creates user account, generates JWT token, stores token in MongoDB
2. **Login**: Validates credentials, generates new JWT token, updates token in MongoDB
3. **Protected Routes**: Validates JWT token from cookies or Authorization header
4. **Logout**: Clears JWT token from MongoDB and cookies

### User Schema (MongoDB)

```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  rollno: String,
  role: "user" | "admin",
  jwtToken: String,        // Stored JWT token
  tokenExpiry: Date,       // Token expiration date
  lastLogin: Date          // Last login timestamp
}
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| GET | `/logout` | Logout user |
| GET | `/check-auth` | Verify authentication |
| GET | `/fetchuser/:id` | Get user details |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/item/:id` | Create new item (auth required) |
| GET | `/item` | Get all items |
| GET | `/item/:id` | Get single item |
| GET | `/item/user/:id` | Get user's items (auth required) |
| PUT | `/item/:id` | Update item (auth required) |
| DELETE | `/item/:id` | Delete item (auth required) |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/claims` | Create claim (auth required) |
| GET | `/claims` | List claims (admin only) |
| GET | `/claims/:id` | Get claim details (auth required) |
| PATCH | `/claims/:id` | Update claim status (admin only) |

## 🧪 Testing

Run authentication tests:
```bash
cd server
node scripts/testAuth.js
node scripts/verifyTokenInDB.js
node scripts/testErrorHandling.js
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookies
- Rate limiting
- Helmet security headers
- XSS protection
- MongoDB injection prevention
- Input validation with express-validator

## 📦 Dependencies

### Backend
- express, mongoose, jsonwebtoken, bcryptjs
- helmet, cors, cookie-parser
- express-validator, express-rate-limit
- express-mongo-sanitize, xss-clean

### Frontend
- react, react-router-dom
- redux, @reduxjs/toolkit
- axios

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- MERN stack community
- MongoDB Atlas for database hosting
