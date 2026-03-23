import listings from "./listings";

export default function TrendingPage({ onOpenModal }) {
  const sorted = [...listings].sort((a, b) => b.saves - a.saves);

  return (
    <main className="list-view">
      <h2 className="page-title">🔥 Trending</h2>
      <div className="trend-grid">
        {sorted.map((item) => (
          <div
            key={item.id}
            className="trend-card"
            onClick={() => onOpenModal(item)}
          >
            <div className="trend-img-wrap">
              <img src={item.image} alt={item.name} />
              <div className="trend-saves">🔥 {item.saves}</div>
            </div>
            <div className="trend-info">
              <span className="brand">{item.brand}</span>
              <p>{item.name}</p>
              <span className="price">{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
