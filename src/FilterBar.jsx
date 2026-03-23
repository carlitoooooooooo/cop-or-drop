import { useState } from "react";
import listings from "./listings";

const allBrands = [...new Set(listings.map((l) => l.brand))].sort();
const allSizes = [...new Set(listings.map((l) => l.size))].sort();

export default function FilterBar({ filters, onChange }) {
  const [open, setOpen] = useState(false);

  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-wrap">
      <div className="filter-top">
        <input
          className="search-input"
          type="text"
          placeholder="Search brand or item..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
        <button className="filter-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? "✕ Close" : "⚙ Filters"}
        </button>
      </div>

      {open && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Brand</label>
            <select value={filters.brand} onChange={(e) => update("brand", e.target.value)}>
              <option value="">All</option>
              {allBrands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Size</label>
            <select value={filters.size} onChange={(e) => update("size", e.target.value)}>
              <option value="">All</option>
              {allSizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Max Price: ${filters.maxPrice >= 9999 ? "Any" : filters.maxPrice}</label>
            <input
              type="range"
              min={0}
              max={9999}
              step={50}
              value={filters.maxPrice}
              onChange={(e) => update("maxPrice", Number(e.target.value))}
            />
          </div>

          <button
            className="filter-reset"
            onClick={() => onChange({ search: "", brand: "", size: "", maxPrice: 9999 })}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
