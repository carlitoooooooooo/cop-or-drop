import listings from "./listings";

const COLLECTIONS = [
  { name: "Best of Supreme", emoji: "👑" },
  { name: "Under $200", emoji: "💸" },
  { name: "Heat Check", emoji: "🔥" },
  { name: "Vintage Vibes", emoji: "📼" },
  { name: "Sneaker Wave", emoji: "👟" },
];

export default function CollectionsPage({ onSelectCollection }) {
  return (
    <main className="list-view">
      <h2 className="page-title">Collections</h2>
      <div className="collections-grid">
        {COLLECTIONS.map((col) => {
          const items = listings.filter((l) => l.collection === col.name);
          const preview = items.slice(0, 3);
          return (
            <div
              key={col.name}
              className="collection-card"
              onClick={() => onSelectCollection(col.name)}
            >
              <div className="collection-preview">
                {preview.map((item) => (
                  <img key={item.id} src={item.image} alt={item.name} />
                ))}
                {preview.length < 3 &&
                  Array.from({ length: 3 - preview.length }).map((_, i) => (
                    <div key={i} className="collection-placeholder" />
                  ))}
              </div>
              <div className="collection-info">
                <span className="collection-emoji">{col.emoji}</span>
                <span className="collection-name">{col.name}</span>
                <span className="collection-count">{items.length} items</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
