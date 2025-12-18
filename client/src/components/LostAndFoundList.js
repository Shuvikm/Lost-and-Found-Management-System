import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import LostFoundItems from "./LostFoundItems";
import LostItems from "./LostItems";
import FoundItems from "./FoundItems";
import config from "./config";
import Spinner from "./Spinner";
import MangaHeader from "./ui/MangaHeader";
import FilterBar from "./FilterBar";

const Base_URL = config.baseURL;

const LostAndFoundList = (props) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(props.req || "all");
  const containerRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    root.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${Base_URL}/item`);
      console.log(res);
      setItems(res.data.gotItem);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = (item) => {
    if (props.req === "lost") {
      return <LostItems key={item._id} item={item} />;
    } else if (props.req === "found") {
      return <FoundItems key={item._id} item={item} />;
    } else {
      return <LostFoundItems key={item._id} item={item} />;
    }
  };

  const filtered = items.filter((it) => {
    const matchesType = type === "all" ? true : it.concerntype === type;
    const q = search.trim().toLowerCase();
    const matchesText = !q
      ? true
      : [it.itemname, it.itemdescription].some((v) =>
          (v || "").toLowerCase().includes(q)
        );
    return matchesType && matchesText;
  });

  return (
    <>
      <Navbar />
      <div className="page-shell" ref={containerRef}>
        <MangaHeader title="Browse Items" subtitle="Search, filter, and explore all lost & found submissions" />
        <FilterBar
          search={search}
          onSearch={setSearch}
          type={type}
          onType={setType}
        />
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <p className="hero-subtitle">No matching items. Try changing filters.</p>
        ) : (
          <div className="item-grid">
            {filtered.map((item) => (
              <div className="reveal" key={item._id}>{renderItem(item)}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LostAndFoundList;
