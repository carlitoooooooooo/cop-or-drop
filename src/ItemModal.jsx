import { useEffect } from "react";

export default function ItemModal({ item, onClose, onAddToCart, onSaveToWishlist }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!item) return null;

  const stars = Array.from({ length: 5 }, (_, i) => {
    const rating = item.seller?.rating || 0;
    if (i < Math.floor(rating)) return "★";
    if (i < rating) return "☆";
    return "☆";
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-image-wrap">
          <img src={item.image} alt={item.name} className="modal-image" />
          <div className="modal-color-badge">{item.color || "—"}</div>
        </div>
        <div className="modal-body">
          <span className="modal-brand">{item.brand}</span>
          <h2 className="modal-name">{item.name}</h2>
          <div className="modal-meta">
            <span className="modal-size">Size: {item.size}</span>
            <span className="modal-condition">{item.condition}</span>
          </div>
          <div className="modal-price">{item.price}</div>

          {item.seller && (
            <div className="modal-seller">
              <div className="seller-name">👤 {item.seller.name}</div>
              <div className="seller-stats">
                <span className="seller-stars">{stars.join("")} {item.seller.rating}</span>
                <span className="seller-sales">{item.seller.sales} sales</span>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              className="modal-btn modal-btn-cart"
              onClick={() => { onAddToCart(item); onClose(); }}
            >
              🛒 Add to Cart
            </button>
            <button
              className="modal-btn modal-btn-wish"
              onClick={() => { onSaveToWishlist(item); onClose(); }}
            >
              ❤️ Save to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
