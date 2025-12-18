import React from "react";
import "../App.css";

const FilterBar = ({ search, onSearch, type, onType }) => {
  return (
    <div className="filter-bar card">
      <input
        type="text"
        placeholder="Search by name or description"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search items"
      />
      <select
        value={type}
        onChange={(e) => onType(e.target.value)}
        aria-label="Filter by type"
      >
        <option value="all">All</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <div className="actions">
        <button className="btn-ghost" onClick={() => onSearch("")}>Clear</button>
      </div>
    </div>
  );
};

export default FilterBar;
