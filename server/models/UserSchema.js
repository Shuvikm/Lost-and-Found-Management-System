const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    rollno: {
        type: String,
        required: true,
        unique: [true, "This Roll No is already registered"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "The entered Email ID is already registered"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    jwtToken: {
        type: String,
        default: null
    },
    tokenExpiry: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

// Store in 'lostandfound_users' collection
module.exports = mongoose.model("User", UserSchema, "lostandfound_users");
