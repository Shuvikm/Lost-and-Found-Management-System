import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./config";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";
import Spinner from "./Spinner"; // Assuming you have a Spinner component

const Base_URL = config.baseURL;

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleNavigateToSignUp = () => {
    navigate("/sign-up");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("Please enter both email and password");
      setLoading(false);
      return;
    }

    const data = {
      email: email.trim(),
      password: password,
    };

    try {
      const res = await axios.post(`${Base_URL}/login`, data, {
        withCredentials: true,
      });

      if (res.status === 200 && res.data.token) {
        const { token, user } = res.data;
        
        // Store token in localStorage
        localStorage.setItem("authToken", token);
        
        // Store user info in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(user));
        
        // Update Redux store with user data
        dispatch(
          login({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token
          })
        );
        
        alert("Successfully signed in!");
        setEmail("");
        setPassword("");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        alert("Invalid email or password. Please try again.");
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.errors?.[0]?.msg || "Please enter valid email and password.";
        alert(errorMsg);
      } else if (error.response?.status === 503) {
        alert("Database unavailable. Please try again later.");
      } else if (error.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signin-container">
        <h2>Sign In</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
          />
        </div>
        <div>
          <button
            className="btn-signin"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign In"}{" "}
            {/* Show Spinner component when loading */}
          </button>
          <p className="btn-spread">Not a member?</p>
          <button className="btn-signin" onClick={handleNavigateToSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}

export default Signin;
