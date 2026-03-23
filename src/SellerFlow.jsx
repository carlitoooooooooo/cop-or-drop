import { useState } from "react";
import { useAuth } from "./AuthContext";

const CONDITIONS = ["New with tags", "Used - Excellent", "Used - Good", "Used - Fair"];
const COLLECTIONS = ["Best of Supreme", "Under $200", "Heat Check", "Vintage Vibes", "Sneaker Wave"];
const COLORS = ["Black", "White", "Red", "Blue", "Green", "Brown", "Grey", "Olive", "Pink", "Orange"];

const empty = { brand: "", name: "", size: "", price: "", condition: CONDITIONS[0], color: COLORS[0], collection: COLLECTIONS[0], image: "" };

export default function SellerFlow({ onDone }) {
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.brand || !form.name || !form.size || !form.price) {
      return setError("Please fill in all required fields.");
    }
    const priceNum = parseFloat(form.price.replace(/[^0-9.]/g, ""));
    if (isNaN(priceNum) || priceNum <= 0) {
      return setError("Enter a valid price.");
    }

    const key = `ds_listings_${user.username}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const newItem = {
      ...form,
      id: Date.now(),
      price: `$${priceNum}`,
      listedAt: new Date().toISOString(),
      saves: 0,
      seller: { name: user.username, rating: 5.0, sales: 0 },
    };
    existing.push(newItem);
    localStorage.setItem(key, JSON.stringify(existing));
    setSuccess(true);
    setForm(empty);
  };

  if (success) {
    return (
      <main className="list-view">
        <div className="seller-success">
          <div className="success-icon">🎉</div>
          <h2>Item Listed!</h2>
          <p>Your item is now live on Cop Or Drop.</p>
          <div className="seller-success-btns">
            <button className="gold-btn" onClick={() => setSuccess(false)}>List Another</button>
            <button className="outline-btn" onClick={onDone}>View My Listings</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="list-view">
      <h2 className="page-title">👤 List an Item</h2>
      <form className="seller-form" onSubmit={submit}>
        <div className="form-group">
          <label>Brand *</label>
          <input value={form.brand} onChange={(e) => update("brand", e.target.value)} placeholder="e.g. Supreme, Off-White" />
        </div>
        <div className="form-group">
          <label>Item Name *</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Box Logo Hoodie" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Size *</label>
            <input value={form.size} onChange={(e) => update("size", e.target.value)} placeholder="e.g. M, L, 10" />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="e.g. 250" />
          </div>
        </div>
        <div className="form-group">
          <label>Condition</label>
          <select value={form.condition} onChange={(e) => update("condition", e.target.value)}>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Color</label>
            <select value={form.color} onChange={(e) => update("color", e.target.value)}>
              {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Collection</label>
            <select value={form.collection} onChange={(e) => update("collection", e.target.value)}>
              {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
          {form.image && (
            <div className="img-preview">
              <img src={form.image} alt="Preview" onError={(e) => (e.target.style.display = "none")} />
            </div>
          )}
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="gold-btn full-width">List Item</button>
      </form>
    </main>
  );
}
