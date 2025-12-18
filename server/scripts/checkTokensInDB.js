// Check JWT tokens in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/UserSchema');

async function checkTokensInDB() {
  try {
    const mongoURI = process.env.mongoURI || process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');
    
    // Find users with JWT tokens
    const usersWithTokens = await User.find({ jwtToken: { $ne: null } })
      .select('username email jwtToken tokenExpiry lastLogin')
      .limit(5);
    
    console.log('=== Users with JWT Tokens in MongoDB ===\n');
    
    if (usersWithTokens.length === 0) {
      console.log('No users found with JWT tokens stored.');
    } else {
      usersWithTokens.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  JWT Token: ${user.jwtToken ? user.jwtToken.substring(0, 50) + '...' : 'null'}`);
        console.log(`  Token Expiry: ${user.tokenExpiry}`);
        console.log(`  Last Login: ${user.lastLogin}`);
        console.log('');
      });
    }
    
    // Count total users
    const totalUsers = await User.countDocuments();
    const usersWithTokenCount = await User.countDocuments({ jwtToken: { $ne: null } });
    
    console.log(`Total users in database: ${totalUsers}`);
    console.log(`Users with active JWT tokens: ${usersWithTokenCount}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkTokensInDB();
