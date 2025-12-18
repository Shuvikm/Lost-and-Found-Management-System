import React, { useState } from "react";

const DisplayCardClaimer = ({ claimant, number }) => {
  const {
    itemdetails,
    claimantname,
    mobilenumber,
    hostelname,
    proofofclaim,
    date,
  } = claimant;
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    background: isHovered 
      ? "linear-gradient(145deg, rgba(245, 200, 66, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)"
      : "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: isHovered 
      ? "1px solid rgba(245, 200, 66, 0.4)"
      : "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "28px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
    boxShadow: isHovered 
      ? "0 25px 50px -12px rgba(245, 200, 66, 0.25)"
      : "0 10px 40px -15px rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  };

  const numberBadgeStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #f5c842 0%, #ff6b6b 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "700",
    color: "#0f0c29",
    boxShadow: "0 4px 15px rgba(245, 200, 66, 0.4)",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  };

  const avatarStyle = {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #ff6b6b 0%, #f59e0b 100%)",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    boxShadow: "0 8px 20px rgba(255, 107, 107, 0.3)",
  };

  const nameStyle = {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
    letterSpacing: "-0.01em",
  };

  const roleStyle = {
    fontSize: "0.85rem",
    color: "#f59e0b",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  };

  const infoGridStyle = {
    display: "grid",
    gap: "16px",
  };

  const infoRowStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  };

  const iconContainerStyle = {
    width: "40px",
    height: "40px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    flexShrink: 0,
  };

  const labelStyle = {
    fontSize: "0.75rem",
    color: "#8892b0",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "4px",
    fontWeight: "500",
  };

  const valueStyle = {
    fontSize: "0.95rem",
    color: "#e6f1ff",
    fontWeight: "500",
    lineHeight: "1.4",
  };

  const itemTagStyle = {
    display: "inline-block",
    background: "linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)",
    padding: "8px 16px",
    borderRadius: "30px",
    fontSize: "0.85rem",
    color: "#ff6b6b",
    fontWeight: "600",
    border: "1px solid rgba(255, 107, 107, 0.3)",
    marginTop: "4px",
  };

  const proofStyle = {
    background: "rgba(139, 92, 246, 0.1)",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    color: "#a78bfa",
    fontStyle: "italic",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    marginTop: "4px",
    lineHeight: "1.5",
  };

  const footerStyle = {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const dateStyle = {
    fontSize: "0.8rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const statusBadgeStyle = {
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    color: "#fff",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={numberBadgeStyle}>#{number}</div>
      
      <div style={headerStyle}>
        <div style={avatarStyle}>
          {getInitials(claimantname)}
        </div>
        <div>
          <div style={nameStyle}>{claimantname || "Anonymous"}</div>
          <div style={roleStyle}>Claimant 📝</div>
        </div>
      </div>

      <div style={infoGridStyle}>
        <div style={infoRowStyle}>
          <div style={iconContainerStyle}>📦</div>
          <div>
            <div style={labelStyle}>Item Claimed</div>
            <div style={itemTagStyle}>{itemdetails || "N/A"}</div>
          </div>
        </div>

        <div style={infoRowStyle}>
          <div style={iconContainerStyle}>📞</div>
          <div>
            <div style={labelStyle}>Contact Number</div>
            <div style={valueStyle}>{mobilenumber || "Not provided"}</div>
          </div>
        </div>

        <div style={infoRowStyle}>
          <div style={iconContainerStyle}>🏠</div>
          <div>
            <div style={labelStyle}>Location</div>
            <div style={valueStyle}>{hostelname || "Not specified"}</div>
          </div>
        </div>

        <div style={infoRowStyle}>
          <div style={iconContainerStyle}>🔐</div>
          <div>
            <div style={labelStyle}>Proof of Ownership</div>
            <div style={proofStyle}>"{proofofclaim || "No proof provided"}"</div>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <div style={dateStyle}>
          <span>📅</span>
          {date ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          }) : "Unknown date"}
        </div>
        <div style={statusBadgeStyle}>
          <span>⏳</span> Pending Review
        </div>
      </div>
    </div>
  );
};

export default DisplayCardClaimer;
