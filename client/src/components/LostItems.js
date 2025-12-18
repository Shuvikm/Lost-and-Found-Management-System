import React, { useState } from "react";
import axios from "axios";
import config from "./config";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

const LostItems = (props) => {
  const { item } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userHostel, setUserHostel] = useState("");

  if (!item || item.concerntype !== "lost") {
    return null;
  }

  const handleHelp = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitHelp = async (_id) => {
    setIsLoading(true);
    try {
      const data = {
        helpername: userName,
        mobilenumber: userMobile,
        hostelname: userHostel,
        itemdetails: `${item.itemname} - ${item.itemdescription}`,
      };

      await axios.post(`${Base_URL}/helper`, data);
      alert("Thank you for offering to help! We'll facilitate the connection.");
      await axios.delete(`${Base_URL}/item/${_id}`);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting help:", error);
      alert("Error submitting help. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="item-card reveal">
      {item.images && item.images.length > 0 && (
        <img 
          className="media" 
          src={item.images[0]} 
          alt={item.itemname}
          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
        />
      )}
      <div className="body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#e5e7eb' }}>{item.itemname}</h3>
          <span className="pill lost">Lost</span>
        </div>
        <p style={{ color: '#9ca3af', marginBottom: '12px', fontSize: '14px', lineHeight: '1.5' }}>
          {item.itemdescription}
        </p>
        <div className="meta">
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {item.date ? new Date(item.date).toLocaleDateString() : 'Recently'}
          </span>
          <button onClick={handleHelp} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '12px' }}>
            🤝 Help Find
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#e5e7eb' }}>Offer Help</h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
              Thank you for helping find: <strong>{item.itemname}</strong>
            </p>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                value={userMobile}
                onChange={(e) => setUserMobile(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Hostel/Location</label>
              <input
                type="text"
                placeholder="Where can they contact you?"
                value={userHostel}
                onChange={(e) => setUserHostel(e.target.value)}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              {isLoading ? (
                <Spinner />
              ) : (
                <button onClick={() => handleSubmitHelp(item._id)} className="btn-primary" style={{ width: '100%' }}>
                  Submit Help
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostItems;
