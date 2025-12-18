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
  const [proofOfClaim, setProofOfClaim] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleHelp = () => {
    setIsModalOpen(true);
  };

  const handleClaim = () => {
    setIsModalOpen(true);
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
      alert(
        "Thank you for contributing to the growth of our community. We are temporarily taking this item off the portal, with the hope that your assistance may aid in returning it to its original owner."
      );
      await axios.delete(`${Base_URL}/item/${_id}`);
      closeModal();
      alert("Item has been successfully removed!");
    } catch (error) {
      console.error("Error submitting help:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClaim = async (_id) => {
    setIsLoading(true);

    try {
      if (!proofOfClaim) {
        alert("Please provide proof of claim.");
        return;
      }

      const data = {
        claimantname: userName,
        mobilenumber: userMobile,
        hostelname: userHostel,
        proofofclaim: proofOfClaim,
        itemdetails: `${item.itemname} - ${item.itemdescription}`,
      };

      await axios.post(`${Base_URL}/claimant`, data);
      alert(
        'The item has been successfully claimed. Please ensure that you have not claimed someone else\'s item. If you have mistakenly done so, kindly resubmit it using the "found" option.'
      );
      await axios.delete(`${Base_URL}/item/${_id}`);
      closeModal();
      alert("Item has been successfully removed!");
    } catch (error) {
      console.error("Error submitting claim:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="item-card reveal">
      <div className="body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#e5e7eb' }}>{item.itemname}</h3>
          <span className={`pill ${item.concerntype}`}>
            {item.concerntype}
          </span>
        </div>
        <p style={{ color: '#9ca3af', marginBottom: '12px', lineHeight: '1.5' }}>{item.itemdescription}</p>
        
        {item.images && item.images.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {item.images.slice(0, 2).map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt="Item" 
                style={{
                  width: '100px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 200, 66, 0.14)'
                }}
              />
            ))}
            {item.images.length > 2 && (
              <div style={{
                width: '100px',
                height: '80px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                +{item.images.length - 2} more
              </div>
            )}
          </div>
        )}
        
        <div className="meta">
          <span style={{ fontSize: '12px' }}>
            {item.date ? new Date(item.date).toLocaleDateString() : 'Recently added'}
          </span>
          <button
            onClick={item.concerntype === "lost" ? handleHelp : handleClaim}
            className={item.concerntype === "lost" ? "btn-ghost" : "btn-primary"}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            {item.concerntype === "lost" ? "🤝 Help" : "✋ Claim"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
              {item.concerntype === "lost" ? "Offer Help" : "Claim This Item"}
            </h3>
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
              <label>Hostel Name</label>
              <input
                type="text"
                placeholder="Enter your hostel name"
                value={userHostel}
                onChange={(e) => setUserHostel(e.target.value)}
              />
            </div>
            {item.concerntype === "found" && (
              <div className="form-group">
                <label>Proof of Ownership</label>
                <input
                  type="text"
                  placeholder="Describe how you can prove this is yours"
                  value={proofOfClaim}
                  onChange={(e) => setProofOfClaim(e.target.value)}
                />
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              {isLoading ? (
                <Spinner />
              ) : (
                <button
                  onClick={
                    item.concerntype === "lost"
                      ? () => handleSubmitHelp(item._id)
                      : () => handleSubmitClaim(item._id)
                  }
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  {item.concerntype === "lost" ? "Submit Help" : "Submit Claim"}
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
