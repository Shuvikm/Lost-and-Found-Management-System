import React, { useState } from "react";
import axios from "axios";
import config from "./config";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

const DisplayPersonalItems = (props) => {
  const { item } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const cardStyle = {
    background: isHovered 
      ? "linear-gradient(145deg, rgba(245, 200, 66, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)"
      : "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: isHovered 
      ? "1px solid rgba(245, 200, 66, 0.4)"
      : "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "0",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
    boxShadow: isHovered 
      ? "0 25px 50px -12px rgba(245, 200, 66, 0.25)"
      : "0 10px 40px -15px rgba(0, 0, 0, 0.3)",
  };

  const imageContainerStyle = {
    position: "relative",
    width: "100%",
    height: "200px",
    background: "rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
  };

  const placeholderStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    fontSize: "4rem",
  };

  const typeBadgeStyle = {
    position: "absolute",
    top: "16px",
    left: "16px",
    padding: "8px 16px",
    borderRadius: "30px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    background: item.concerntype === "lost" 
      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "#fff",
    boxShadow: item.concerntype === "lost"
      ? "0 4px 15px rgba(239, 68, 68, 0.4)"
      : "0 4px 15px rgba(34, 197, 94, 0.4)",
  };

  const contentStyle = {
    padding: "24px",
  };

  const nameStyle = {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
    letterSpacing: "-0.01em",
  };

  const descriptionStyle = {
    fontSize: "0.95rem",
    color: "#8892b0",
    lineHeight: "1.6",
    marginBottom: "20px",
  };

  const footerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  };

  const dateStyle = {
    fontSize: "0.8rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const resolveButtonStyle = {
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
  };

  const handleResolve = async (_id) => {
    setIsLoading(true);

    try {
      await axios.delete(`${Base_URL}/item/${_id}`, { withCredentials: true });
      alert("Item has been successfully resolved!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to resolve item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageContainerStyle}>
        {item.images && item.images.length > 0 ? (
          <>
            {imageLoading && (
              <div style={placeholderStyle}>
                <Spinner />
              </div>
            )}
            <img 
              src={item.images[0]} 
              alt={item.itemname}
              style={{...imageStyle, display: imageLoading ? 'none' : 'block'}}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </>
        ) : (
          <div style={placeholderStyle}>
            {item.concerntype === "lost" ? "🔍" : "📦"}
          </div>
        )}
        <div style={typeBadgeStyle}>
          {item.concerntype === "lost" ? "🔴 Lost" : "🟢 Found"}
        </div>
      </div>

      <div style={contentStyle}>
        <h2 style={nameStyle}>{item.itemname || "Unnamed Item"}</h2>
        <p style={descriptionStyle}>
          {item.itemdescription || "No description provided"}
        </p>

        <div style={footerStyle}>
          <div style={dateStyle}>
            <span>📅</span>
            {item.date ? new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            }) : "Unknown date"}
          </div>

          {isLoading ? (
            <Spinner />
          ) : (
            <button 
              onClick={() => handleResolve(item._id)} 
              style={resolveButtonStyle}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.3)";
              }}
            >
              ✓ Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayPersonalItems;
