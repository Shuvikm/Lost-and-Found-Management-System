import React, { useState, useEffect } from "react";
import axios from "axios";
import DisplayCardClaimer from "./DisplayCardClaimer";
import Navbar from "./Navbar";
import config from "./config";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

const ClaimantList = () => {
  const [claimants, setClaimants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClaimants();
  }, []);

  const fetchClaimants = async () => {
    try {
      const res = await axios.get(`${Base_URL}/claimant`);
      setClaimants(res.data.gotClaimant);
    } catch (error) {
      console.error("Error fetching claimants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClaimants = claimants.filter(claimant =>
    claimant.claimantname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claimant.itemdetails?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    marginBottom: "30px",
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

  const searchContainerStyle = {
    maxWidth: "500px",
    margin: "0 auto 40px",
  };

  const searchInputStyle = {
    width: "100%",
    padding: "16px 24px",
    fontSize: "1rem",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "50px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    outline: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
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
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📋 Claim Requests</h1>
          <p style={subtitleStyle}>
            People who are claiming ownership of found items
          </p>
        </div>

        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{claimants.length}</div>
            <div style={statLabelStyle}>Total Claims</div>
          </div>
          <div style={statCardStyle}>
            <div style={{...statNumberStyle, color: "#f59e0b"}}>⏳</div>
            <div style={statLabelStyle}>Pending</div>
          </div>
          <div style={statCardStyle}>
            <div style={{...statNumberStyle, color: "#22c55e"}}>✓</div>
            <div style={statLabelStyle}>Verified</div>
          </div>
        </div>

        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="🔍 Search by claimant name or item..."
            style={searchInputStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "#f5c842";
              e.target.style.boxShadow = "0 0 20px rgba(245, 200, 66, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {isLoading ? (
          <Spinner />
        ) : filteredClaimants.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>📭</div>
            <p style={emptyTextStyle}>
              {searchTerm ? "No claimants match your search" : "No claim requests yet"}
            </p>
          </div>
        ) : (
          <div style={gridStyle}>
            {filteredClaimants.map((claimant, index) => (
              <DisplayCardClaimer
                key={claimant._id}
                claimant={claimant}
                number={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimantList;
