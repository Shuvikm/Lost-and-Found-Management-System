import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import DisplayPersonalItems from "./DisplayPersonalItems";
import { jwtDecode } from "jwt-decode";
import config from "./config";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

const PersonalItems = (props) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          console.error("No authentication token found");
          return;
        }

        const decodedToken = decodeJwtToken(authToken);
        const userId = decodedToken.sub;

        const response = await axios.get(`${Base_URL}/item/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            withCredentials: true,
          },
        });

        setItems(response.data.gotItems);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const decodeJwtToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
    paddingBottom: "60px",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "40px",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #f5c842 0%, #ff6b6b 50%, #4ecdc4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "10px",
    letterSpacing: "-0.02em",
  };

  const subtitleStyle = {
    color: "#8892b0",
    fontSize: "1.1rem",
    fontWeight: "400",
  };

  const statsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "40px",
    flexWrap: "wrap",
  };

  const statCardStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "20px 40px",
    textAlign: "center",
    minWidth: "150px",
  };

  const statNumberStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#f5c842",
    marginBottom: "5px",
  };

  const statLabelStyle = {
    color: "#8892b0",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  };

  const emptyStateStyle = {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "20px",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
  };

  const emptyIconStyle = {
    fontSize: "4rem",
    marginBottom: "20px",
  };

  const emptyTextStyle = {
    color: "#8892b0",
    fontSize: "1.2rem",
    marginBottom: "10px",
  };

  const tipStyle = {
    color: "#64748b",
    fontSize: "0.95rem",
  };

  const lostItems = items.filter(item => item.concerntype === "lost");
  const foundItems = items.filter(item => item.concerntype === "found");

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📦 My Items</h1>
          <p style={subtitleStyle}>
            Track and manage your reported lost and found items
          </p>
        </div>

        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{items.length}</div>
            <div style={statLabelStyle}>Total Items</div>
          </div>
          <div style={statCardStyle}>
            <div style={{...statNumberStyle, color: "#ef4444"}}>{lostItems.length}</div>
            <div style={statLabelStyle}>Lost</div>
          </div>
          <div style={statCardStyle}>
            <div style={{...statNumberStyle, color: "#22c55e"}}>{foundItems.length}</div>
            <div style={statLabelStyle}>Found</div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <Spinner />
            <p style={{ color: "#8892b0", marginTop: "20px" }}>Loading your items...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>📭</div>
            <p style={emptyTextStyle}>No items found</p>
            <p style={tipStyle}>
              💡 Tip: Use "Raise a Concern" to report a lost or found item
            </p>
          </div>
        ) : (
          <div style={gridStyle}>
            {items.map((item) => (
              <DisplayPersonalItems key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalItems;
