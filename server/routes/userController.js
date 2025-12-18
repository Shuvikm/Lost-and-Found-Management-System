const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require("../models/UserSchema");
const { validationResult } = require('express-validator');

const checkDbConnection = (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ error: "Database unavailable. Please try again later." });
    return false;
  }
  return true;
};

const signup = async (req, res) => {
  try {
    if (!checkDbConnection(req, res)) return;
    const { username, rollno, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists. Please use a different email." });
    }

    // Check if rollno already exists
    const existingRollNo = await User.findOne({ rollno: rollno });
    if (existingRollNo) {
      return res.status(409).json({ message: "Roll number already exists. Please use a different roll number." });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a user with the data
    const user = await User.create({
      username: username,
      rollno: rollno,
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Create JWT token with 30-day expiration for immediate login after signup
    const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign(
      { 
        sub: user._id, 
        expirationTime: expirationTime, 
        role: user.role 
      }, 
      process.env.SECRETKEY
    );

    // Save JWT token to MongoDB
    user.jwtToken = token;
    user.tokenExpiry = new Date(expirationTime);
    user.lastLogin = new Date();
    await user.save();

    // Set authorization cookie
    res.cookie("Authorization", token, {
      expires: new Date(expirationTime),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production"
    });

    // Respond with the user data and token
    res.status(201).json({ 
      token,
      user: { 
        _id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      message: "User registered successfully" 
    });
  } catch (error) {
    // Handle errors here
    console.error("Error during signup:", error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ message: `${field} already registered.` });
    }
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    if (!checkDbConnection(req, res)) return;
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with hash
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token with 30-day expiration
    const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign(
      { 
        sub: user._id, 
        expirationTime: expirationTime, 
        role: user.role 
      }, 
      process.env.SECRETKEY
    );

    // Save JWT token to MongoDB
    user.jwtToken = token;
    user.tokenExpiry = new Date(expirationTime);
    user.lastLogin = new Date();
    await user.save();

    // Set authorization cookie
    res.cookie("Authorization", token, {
      expires: new Date(expirationTime),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production"
    });

    // Return token and user info
    res.status(200).json({ 
      token, 
      user: { 
        _id: user._id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      },
      message: "Login successful"
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const logout = async (req, res) => {
  try {
    // Clear JWT token from database if user is authenticated
    let token = req.cookies.Authorization;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.SECRETKEY);
        // Clear token from user in database
        await User.findByIdAndUpdate(decodedToken.sub, {
          jwtToken: null,
          tokenExpiry: null
        });
      } catch (err) {
        // Token might be expired or invalid, continue with logout
        console.log("Token verification failed during logout:", err.message);
      }
    }

    res.clearCookie("Authorization");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const fetchUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ gotUser: user });
  } catch (error) {
    console.error("Error during fetchUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const checkAuth = (req, res) => {
  try {
    res.status(200).json({ user: { _id: req.user._id, username: req.user.username, role: req.user.role } });
  } catch (error) {
    // Handle errors here
    console.error("Error during checkAuth:", error);
    res.status(500).send("Internal Server Error");
  }
}


module.exports = {
  signup: signup,
  fetchUser:fetchUser,
  login: login,
  logout: logout,
  checkAuth: checkAuth
}
