import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GroupInfo from "./GroupInfo";
import Navbar from "./Navbar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "./config";
import { useSelector } from "react-redux";
import { selectUser } from "../utils/userSlice";
import "./HomePage.css";

const Base_URL = config.baseURL;

const HomePage = () => {
  const user = useSelector(selectUser);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Assuming you have a token stored in localStorage after user login
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          console.error("No authentication token found");
          return;
        }
        // console.log(authToken);
        // Decode the JWT token to get user information
        const decodedToken = decodeJwtToken(authToken);

        // console.log('decodedToken:', decodedToken);
        const userId = decodedToken.sub;
        // console.log(userId);

        // Replace 'your-api-endpoint' with the actual endpoint for fetching user details
        const response = await axios.get(`${Base_URL}/fetchuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            withCredentials: true,
          },
        });

        // Assuming the response contains user details with 'username' property
        setUserDetails(response);
        // console.log(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const decodeJwtToken = (token) => {
    try {
      // Use jwtDecode to decode the JWT token
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  };

  const containerStyle = {
    marginTop: "4rem",
  };
  const username = userDetails?.data?.gotUser?.username;
  const rollno = userDetails?.data?.gotUser?.rollno;

  return (
    <>
      <Navbar />
      <main className="home-hero">
        <section className="hero-left">
          <span className="hero-badge">Campus Lost & Found</span>
          <h1 className="hero-title">
            Find lost items faster. Return found items safely.
          </h1>
          <p className="hero-subtitle">
            A single place to raise concerns, track submissions, and connect
            claimants with helpers. Keep your campus belongings flowing to the
            right owners.
          </p>
          <div className="hero-actions">
            {user && userDetails ? (
              <>
                <Link className="btn-primary" to="/raise-a-concern">
                  Raise a concern
                </Link>
                <Link className="btn-ghost" to="/my-items">
                  My items
                </Link>
              </>
            ) : (
              <>
                <Link className="btn-primary" to="/sign-in">
                  Sign in
                </Link>
                <Link className="btn-ghost" to="/sign-up">
                  Create account
                </Link>
              </>
            )}
            <Link className="btn-ghost" to="/all-items">
              Browse items
            </Link>
          </div>
          {user && username && (
            <div className="pill">
              <span>Signed in as</span>
              <strong>
                {username} ({rollno})
              </strong>
            </div>
          )}
        </section>

        <section className="hero-right">
          <h3>Quick actions</h3>
          <div className="hero-stat">
            <div>
              <small className="hero-subtitle">New report</small>
              <div>Raise a lost or found entry</div>
            </div>
            <Link className="btn-primary" to="/raise-a-concern">
              Start
            </Link>
          </div>
          <div className="hero-stat">
            <div>
              <small className="hero-subtitle">See all items</small>
              <div>Filter by lost / found</div>
            </div>
            <Link className="btn-ghost" to="/all-items">
              View
            </Link>
          </div>
          <div className="hero-stat">
            <div>
              <small className="hero-subtitle">My submissions</small>
              <div>Track what you reported</div>
            </div>
            <Link className="btn-ghost" to="/my-items">
              Open
            </Link>
          </div>
        </section>
      </main>

      <section className="feature-grid">
        <div className="feature-card">
          <h4>Guided flow</h4>
          <p>Structured steps so you always provide the details that help.</p>
        </div>
        <div className="feature-card">
          <h4>Image-first entries</h4>
          <p>Attach photos to speed up matching between claimants and helpers.</p>
        </div>
        <div className="feature-card">
          <h4>Realtime updates</h4>
          <p>Fresh list of all lost and found items across campus.</p>
        </div>
      </section>

      <section className="team-shell card" style={containerStyle}>
        <h3>Community</h3>
        <p className="hero-subtitle">
          Built for students and staff to keep belongings safe and moving to the
          right hands.
        </p>
        <GroupInfo />
      </section>
    </>
  );
};

export default HomePage;
