import listings from "./listings";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function isNew(listedAt) {
  return Date.now() - new Date(listedAt).getTime() < THREE_DAYS_MS;
}

export default function NewDropsPage({ onOpenModal }) {
  const sorted = [...listings].sort(
    (a, b) => new Date(b.listedAt) - new Date(a.listedAt)
  );

  return (
    <main className="list-view">
      <h2 className="page-title">✨ New Drops</h2>
      <div className="trend-grid">
        {sorted.map((item) => (
          <div
            key={item.id}
            className="trend-card"
            onClick={() => onOpenModal(item)}
          >
            <div className="trend-img-wrap">
              <img src={item.image} alt={item.name} />
              {isNew(item.listedAt) && (
                <div className="new-badge">NEW</div>
              )}
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
