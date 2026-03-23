import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function SellerDashboard({ onListNew }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const key = `ds_listings_${user.username}`;
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    setItems(stored);
  }, [user.username]);

  const deleteItem = (id) => {
    const key = `ds_listings_${user.username}`;
    const updated = items.filter((i) => i.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    setItems(updated);
  };

  return (
    <main className="list-view">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">My Listings</h2>
          <p className="dashboard-count">
            {items.length === 0 ? "No listings yet" : `${items.length} item${items.length !== 1 ? "s" : ""} listed`}
          </p>
        </div>
        <button className="gold-btn" onClick={onListNew}>+ List Item</button>
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <p>You haven't listed anything yet.</p>
          <button className="gold-btn" onClick={onListNew}>List Your First Item</button>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <div className="list-card" key={item.id}>
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="list-card-no-img">📷</div>
              )}
              <div className="list-info">
                <span className="brand">{item.brand}</span>
                <p>{item.name}</p>
                <span className="price">{item.price}</span>
                <span className="list-condition">{item.condition}</span>
              </div>
              <button
                className="remove-btn"
                onClick={() => deleteItem(item.id)}
                title="Delete listing"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
