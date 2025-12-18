import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout, selectUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import config from "./config";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Call server logout endpoint to clear token from database
      const token = localStorage.getItem("authToken");
      await axios.get(`${config.baseURL}/logout`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Always dispatch logout to clear local state
      dispatch(logout());
      navigate("/home");
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.matchMedia("(max-width: 1000px)").matches);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className={`navbar-links ${isSmallScreen ? "hidden" : ""}`}>
          <Link to="/home" className="nav-link">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/my-items" className="nav-link">My Items</Link>
              <Link to="/all-items" className="nav-link">All Items</Link>
              <Link to="/all-items/lost" className="nav-link">Lost</Link>
              <Link to="/all-items/found" className="nav-link">Found</Link>
              <Link to="/raise-a-concern" className="nav-link highlight">Raise a concern</Link>
              <Link to="/helpers" className="nav-link">Helpers</Link>
              <Link to="/claimants" className="nav-link">Claimers</Link>
              <Link to="/" className="nav-link logout" onClick={handleLogout}>Logout</Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/sign-up" className="nav-link">Sign Up</Link>
              <Link to="/sign-in" className="nav-link highlight">Sign In</Link>
            </>
          )}
        </div>
        <span className={`menu-icon ${isSmallScreen ? "" : "hidden"}`} onClick={handleToggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </span>
      </div>

      <div className={`mobile-menu ${menuOpen && isSmallScreen ? "open" : ""}`}>
        <Link to="/home" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
        {user && (
          <>
            <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/my-items" className="nav-link" onClick={() => setMenuOpen(false)}>My Items</Link>
            <Link to="/all-items" className="nav-link" onClick={() => setMenuOpen(false)}>All Items</Link>
            <Link to="/all-items/lost" className="nav-link" onClick={() => setMenuOpen(false)}>Lost</Link>
            <Link to="/all-items/found" className="nav-link" onClick={() => setMenuOpen(false)}>Found</Link>
            <Link to="/raise-a-concern" className="nav-link highlight" onClick={() => setMenuOpen(false)}>Raise a concern</Link>
            <Link to="/helpers" className="nav-link" onClick={() => setMenuOpen(false)}>Helpers</Link>
            <Link to="/claimants" className="nav-link" onClick={() => setMenuOpen(false)}>Claimers</Link>
            <Link to="/" className="nav-link logout" onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/sign-up" className="nav-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            <Link to="/sign-in" className="nav-link highlight" onClick={() => setMenuOpen(false)}>Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
