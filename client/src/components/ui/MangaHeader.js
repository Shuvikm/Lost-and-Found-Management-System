import React from "react";
import "../../App.css";

const MangaHeader = ({ title, subtitle }) => {
  return (
    <header style={{ marginBottom: 16 }}>
      <h2 className="chapter-title">{title}</h2>
      {subtitle && <p className="hero-subtitle" style={{ marginTop: 8 }}>{subtitle}</p>}
    </header>
  );
};

export default MangaHeader;
