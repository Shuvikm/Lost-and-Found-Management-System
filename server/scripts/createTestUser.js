const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectToMongo = require("../config/connectToMongo");
const User = require("../models/UserSchema");

// Load environment variables
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const createTestUser = async () => {
  try {
    await connectToMongo();

    const testUser = {
      username: "Test User",
      rollno: "23CSR001",
      email: "mshuvik@gmail.com",
      password: bcrypt.hashSync("123456", 8),
      role: "user"
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log("User already exists! Updating password...");
      existingUser.password = bcrypt.hashSync("123456", 8);
      await existingUser.save();
      console.log("Password updated successfully!");
    } else {
      await User.create(testUser);
      console.log("Test user created successfully!");
    }

    console.log("\n--- Login Credentials ---");
    console.log("Email: mshuvik@gmail.com");
    console.log("Password: 123456");
    console.log("-------------------------\n");

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createTestUser();
