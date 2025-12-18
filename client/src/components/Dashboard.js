import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import MangaHeader from "./ui/MangaHeader";
import Spinner from "./Spinner";
import config from "./config";
import { useSelector } from "react-redux";
import { selectUser } from "../utils/userSlice";
import { jwtDecode } from "jwt-decode";

const Base_URL = config.baseURL;

const Dashboard = () => {
  const user = useSelector(selectUser);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return setLoading(false);
        const decoded = jwtDecode(token);
        const res = await axios.get(`${Base_URL}/item/user/${decoded.sub}`);
        setItems(res.data.gotItems || []);
      } catch (e) {
        console.error("Error loading user items", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const lostCount = items.filter((i) => i.concerntype === "lost").length;
  const foundCount = items.filter((i) => i.concerntype === "found").length;

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <MangaHeader title="Your Dashboard" subtitle="Overview of your submissions and statuses" />
        {loading ? (
          <Spinner />
        ) : (
          <div className="stat-grid" style={{ marginBottom: 18 }}>
            <div className="stat-card"><small className="hero-subtitle">Total</small><div><strong>{items.length}</strong> items</div></div>
            <div className="stat-card"><small className="hero-subtitle">Lost</small><div><strong>{lostCount}</strong></div></div>
            <div className="stat-card"><small className="hero-subtitle">Found</small><div><strong>{foundCount}</strong></div></div>
          </div>
        )}
        <div className="item-grid">
          {items.map((item) => (
            <div className="item-card" key={item._id}>
              {item.images?.length ? (
                <img className="media" src={item.images[0]} alt={item.itemname} />
              ) : (
                <div className="media" />
              )}
              <div className="body">
                <h3 style={{ margin: 0 }}>{item.itemname}</h3>
                <p style={{ marginTop: 6 }}>{item.itemdescription}</p>
                <div className="meta">
                  <span className="tag">{item.concerntype}</span>
                  <small>{new Date(item.date).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
