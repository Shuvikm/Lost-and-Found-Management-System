import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import config from "./config";
import Navbar from "./Navbar";
import MangaHeader from "./ui/MangaHeader";
import Spinner from "./Spinner";

const Base_URL = config.baseURL;

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(`${Base_URL}/item/${id}`);
        setItem(res.data.gotItem);
      } catch (e) {
        console.error("Error loading item", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="page-shell"><Spinner /></div>
    </>
  );

  if (!item) return (
    <>
      <Navbar />
      <div className="page-shell"><p className="hero-subtitle">Item not found.</p></div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <MangaHeader title={item.itemname} subtitle={`${item.concerntype?.toUpperCase()} • ${new Date(item.date).toLocaleDateString()}`} />
        <div className="card">
          {item.images?.length ? (
            <img className="media" alt={item.itemname} src={item.images[0]} style={{ width: "100%" }} />
          ) : (
            <div className="media" />
          )}
          <div style={{ marginTop: 16 }}>
            <p style={{ marginTop: 6 }}>{item.itemdescription}</p>
            <div className="stat-grid" style={{ marginTop: 12 }}>
              <div className="stat-card"><small className="hero-subtitle">Type</small><div>{item.concerntype}</div></div>
              <div className="stat-card"><small className="hero-subtitle">Date</small><div>{new Date(item.date).toLocaleString()}</div></div>
              <div className="stat-card"><small className="hero-subtitle">ID</small><div>{item._id}</div></div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link className="btn-ghost" to="/all-items">Back to list</Link>
          <Link className="btn-ghost" to={item.concerntype === "lost" ? "/all-items/lost" : "/all-items/found"}>Related items</Link>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
