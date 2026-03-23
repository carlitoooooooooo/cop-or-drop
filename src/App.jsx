import { useState, useEffect } from "react";
import SwipeCard from "./SwipeCard";
import FilterBar from "./FilterBar";
import ItemModal from "./ItemModal";
import CollectionsPage from "./CollectionsPage";
import TrendingPage from "./TrendingPage";
import NewDropsPage from "./NewDropsPage";
import SellerFlow from "./SellerFlow";
import SellerDashboard from "./SellerDashboard";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import SpaceBackground from "./SpaceBackground";
import listings from "./listings";
import "./App.css";

const defaultFilters = { search: "", brand: "", size: "", maxPrice: 9999, collection: "" };

function App() {
  const { user, logout, getUserData, setUserData } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [filters, setFilters] = useState(defaultFilters);
  const [wishlist, setWishlist] = useState(() => getUserData("wishlist"));
  const [cart, setCart] = useState(() => getUserData("cart"));
  const [seen, setSeen] = useState(() => getUserData("seen"));
  const [lastAction, setLastAction] = useState(null);
  const [view, setView] = useState("swipe");
  const [modalItem, setModalItem] = useState(null);
  // For collection drill-down: when set, swipe view filters by it
  const [activeCollection, setActiveCollection] = useState(null);
  // Seller sub-view: "dashboard" | "list"
  const [sellView, setSellView] = useState("dashboard");

  useEffect(() => { setUserData("wishlist", wishlist); }, [wishlist]);
  useEffect(() => { setUserData("cart", cart); }, [cart]);
  useEffect(() => { setUserData("seen", seen); }, [seen]);

  const dripScore = cart.length * 10 + wishlist.length * 5 + seen.length * 1;

  const filteredListings = listings.filter((item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ""));
    const matchSearch = !filters.search ||
      item.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchBrand = !filters.brand || item.brand === filters.brand;
    const matchSize = !filters.size || item.size === filters.size;
    const matchPrice = price <= filters.maxPrice;
    const matchCollection = !activeCollection || item.collection === activeCollection;
    return matchSearch && matchBrand && matchSize && matchPrice && matchCollection;
  });

  const cards = filteredListings.filter((item) => !seen.includes(item.id));

  const onSwipe = (direction, item) => {
    setSeen((prev) => [...prev, item.id]);
    if (direction === "right") {
      if (!cart.find((i) => i.id === item.id)) setCart((prev) => [...prev, item]);
      setLastAction({ type: "cart", item, key: Date.now() });
    } else if (direction === "up") {
      if (!wishlist.find((i) => i.id === item.id)) setWishlist((prev) => [...prev, item]);
      setLastAction({ type: "wishlist", item, key: Date.now() });
    } else {
      setLastAction({ type: "skip", item, key: Date.now() });
    }
  };

  const addToCart = (item) => {
    if (!cart.find((i) => i.id === item.id)) {
      setCart((prev) => [...prev, item]);
      setLastAction({ type: "cart", item, key: Date.now() });
    }
  };

  const addToWishlist = (item) => {
    if (!wishlist.find((i) => i.id === item.id)) {
      setWishlist((prev) => [...prev, item]);
      setLastAction({ type: "wishlist", item, key: Date.now() });
    }
  };

  const resetDeck = () => {
    setUserData("seen", []);
    setSeen([]);
    setLastAction(null);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((i) => i.id !== id));

  const openModal = (item) => setModalItem(item);
  const closeModal = () => setModalItem(null);

  const handleSelectCollection = (colName) => {
    setActiveCollection(colName);
    setView("swipe");
  };

  const clearCollection = () => {
    setActiveCollection(null);
  };

  const isEmpty = cards.length === 0;

  const navTo = (v) => {
    setView(v);
    if (v !== "swipe") setActiveCollection(null);
  };

  return (
    <div className="app">
      <SpaceBackground />
      <header className="header">
        <h1 className="logo">Cop Or <span>Drop</span></h1>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="logout-btn" onClick={logout} title="Log out">↩</button>
        </div>
      </header>

      <nav className="bottom-nav">
        <button onClick={() => navTo("swipe")} className={view === "swipe" ? "active" : ""}>
          🔍<span className="nav-label">Discover</span>
        </button>
        <button onClick={() => navTo("trending")} className={view === "trending" ? "active" : ""}>
          🔥<span className="nav-label">Trending</span>
        </button>
        <button onClick={() => navTo("newdrops")} className={view === "newdrops" ? "active" : ""}>
          ✨<span className="nav-label">New</span>
        </button>
        <button onClick={() => navTo("collections")} className={view === "collections" ? "active" : ""}>
          🗂<span className="nav-label">Collections</span>
        </button>
        <button onClick={() => navTo("wishlist")} className={view === "wishlist" ? "active" : ""}>
          ❤️{wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          <span className="nav-label">Wishlist</span>
        </button>
        <button onClick={() => navTo("cart")} className={view === "cart" ? "active" : ""}>
          🛒{cart.length > 0 && <span className="badge">{cart.length}</span>}
          <span className="nav-label">Cart</span>
        </button>
        <button onClick={() => { navTo("sell"); setSellView("dashboard"); }} className={view === "sell" ? "active" : ""}>
          👤<span className="nav-label">Sell</span>
        </button>
      </nav>

      <div className="user-bar">
        <span>👤 {user.username}</span>
        <span className="drip-score">🤎 Drip Score: {dripScore}</span>
      </div>

      {/* Discover / Swipe View */}
      {view === "swipe" && (
        <main className="swipe-view">
          {activeCollection && (
            <div className="collection-banner">
              <span>🗂 {activeCollection}</span>
              <button onClick={clearCollection}>✕ All Items</button>
            </div>
          )}
          <FilterBar filters={filters} onChange={setFilters} />

          {isEmpty ? (
            <div className="empty">
              <p>{filteredListings.length === 0 ? "No items match your filters." : "You've seen everything 👀"}</p>
              {filteredListings.length > 0 && <button onClick={resetDeck}>Start over</button>}
              {filteredListings.length === 0 && (
                <button onClick={() => { setFilters(defaultFilters); setActiveCollection(null); }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="card-stack">
                {[...cards].reverse().map((item, i) => (
                  <SwipeCard
                    key={item.id}
                    item={item}
                    onSwipe={onSwipe}
                    isTop={i === cards.length - 1}
                    onTap={openModal}
                  />
                ))}
              </div>

              <div className="hints">
                <span>← Skip</span>
                <span>↑ Wishlist</span>
                <span>→ Cart</span>
                <span>Tap = Details</span>
              </div>

              {lastAction && (
                <div key={lastAction.key} className={`toast toast-${lastAction.type}`}>
                  {lastAction.type === "cart" && `🛒 Added to cart`}
                  {lastAction.type === "wishlist" && `❤️ Saved to wishlist`}
                  {lastAction.type === "skip" && `⏭ Skipped`}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* Trending */}
      {view === "trending" && (
        <TrendingPage onOpenModal={openModal} />
      )}

      {/* New Drops */}
      {view === "newdrops" && (
        <NewDropsPage onOpenModal={openModal} />
      )}

      {/* Collections */}
      {view === "collections" && (
        <CollectionsPage onSelectCollection={handleSelectCollection} />
      )}

      {/* Wishlist */}
      {view === "wishlist" && (
        <main className="list-view">
          <h2 className="page-title">Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="empty-list">Nothing saved yet. Swipe up to save items.</p>
          ) : (
            <div className="grid">
              {wishlist.map((item) => (
                <div className="list-card" key={item.id} onClick={() => openModal(item)} style={{ cursor: "pointer" }}>
                  <img src={item.image} alt={item.name} />
                  <div className="list-info">
                    <span className="brand">{item.brand}</span>
                    <p>{item.name}</p>
                    <span className="price">{item.price}</span>
                  </div>
                  <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.id); }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Cart */}
      {view === "cart" && (
        <main className="list-view">
          <h2 className="page-title">Cart</h2>
          {cart.length === 0 ? (
            <p className="empty-list">Nothing in cart yet. Swipe right to add items.</p>
          ) : (
            <>
              <div className="grid">
                {cart.map((item) => (
                  <div className="list-card" key={item.id} onClick={() => openModal(item)} style={{ cursor: "pointer" }}>
                    <img src={item.image} alt={item.name} />
                    <div className="list-info">
                      <span className="brand">{item.brand}</span>
                      <p>{item.name}</p>
                      <span className="price">{item.price}</span>
                    </div>
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>✕</button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total: </strong>
                {cart.reduce((sum, item) => sum + parseInt(item.price.replace(/[^0-9]/g, "")), 0)
                  .toLocaleString("en-US", { style: "currency", currency: "USD" })}
                <button className="checkout-btn">Checkout</button>
              </div>
            </>
          )}
        </main>
      )}

      {/* Sell */}
      {view === "sell" && sellView === "dashboard" && (
        <SellerDashboard onListNew={() => setSellView("list")} />
      )}
      {view === "sell" && sellView === "list" && (
        <SellerFlow onDone={() => setSellView("dashboard")} />
      )}

      {/* Item Modal */}
      {modalItem && (
        <ItemModal
          item={modalItem}
          onClose={closeModal}
          onAddToCart={addToCart}
          onSaveToWishlist={addToWishlist}
        />
      )}
    </div>
  );
}

export default App;
