import React from "react";
import "./GroupInfo.css";

const GroupInfo = () => {
  const members = [
    {
      name: "Ankesh Kumar",
      id: "B210821CS",
      email: "ankesh_b2100821cs@nitc.ac.in",
      role: "Lead Dev",
      icon: "💻",
    },
    {
      name: "Pranav Prashant",
      id: "B210460CS",
      email: "pranav_b210460cs@nitc.ac.in",
      role: "Full Stack",
      icon: "🚀",
    },
    {
      name: "Rahul B Menon",
      id: "B210482CS",
      email: "rahul_b210482cs@nitc.ac.in",
      role: "Backend",
      icon: "⚙️",
    },
    {
      name: "Rahul P Aroli",
      id: "B210544CS",
      email: "rahul_b210544cs@nitc.ac.in",
      role: "Frontend",
      icon: "🎨",
    },
    {
      name: "S Rishi Mohan",
      id: "B210552CS",
      email: "rishi_b210552cs@nitc.ac.in",
      role: "Database",
      icon: "🗄️",
    },
  ];

  return (
    <div className="team-container">
      <div className="team-header">
        <h3 className="team-title">Team Behind the Mission</h3>
        <div className="team-divider"></div>
      </div>
      <p className="team-description">
        A dedicated squad of engineers building a secure, investigative system to reunite campus
        belongings with their rightful owners. Inspired by precision and driven by community.
      </p>

      <div className="members-grid">
        {members.map((member, idx) => (
          <div key={idx} className="member-card">
            <div className="member-header">
              <div className="member-icon">{member.icon}</div>
              <div className="member-role">{member.role}</div>
            </div>

            <div className="member-content">
              <h4 className="member-name">{member.name}</h4>
              <p className="member-id">{member.id}</p>

              <a href={`mailto:${member.email}`} className="member-email">
                <span className="email-icon">✉</span>
                <span className="email-text">{member.email}</span>
              </a>
            </div>

            <div className="member-accent"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupInfo;
