import { useRef, useState } from "react";

export default function SwipeCard({ item, onSwipe, isTop, onTap }) {
  const cardRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [gone, setGone] = useState(false);

  const getRotation = () => offset.x / 15;
  const swipeThreshold = 100;

  const onPointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    cardRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    setOffset({
      x: e.clientX - startX.current,
      y: e.clientY - startY.current,
    });
  };

  const onPointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Tap detection: moved less than 5px → open modal
    if (dist < 5) {
      setOffset({ x: 0, y: 0 });
      if (onTap) onTap(item);
      return;
    }

    if (offset.x > swipeThreshold) {
      flyOut("right");
    } else if (offset.x < -swipeThreshold) {
      flyOut("left");
    } else if (offset.y < -swipeThreshold) {
      flyOut("up");
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const flyOut = (direction) => {
    setGone(true);
    const flyX = direction === "right" ? 800 : direction === "left" ? -800 : 0;
    const flyY = direction === "up" ? -800 : 0;
    setOffset({ x: flyX, y: flyY });
    setTimeout(() => onSwipe(direction, item), 300);
  };

  if (gone) return null;

  const likeOpacity = Math.min(offset.x / 80, 1);
  const nopeOpacity = Math.min(-offset.x / 80, 1);
  const wishOpacity = Math.min(-offset.y / 80, 1);

  return (
    <div
      ref={cardRef}
      className={`tinder-card ${isTop ? "top" : ""}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${getRotation()}deg)`,
        transition: isDragging.current ? "none" : "transform 0.3s ease",
        cursor: isDragging.current ? "grabbing" : "grab",
        zIndex: isTop ? 10 : 1,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="card" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="stamp stamp-like" style={{ opacity: likeOpacity }}>CART</div>
        <div className="stamp stamp-nope" style={{ opacity: nopeOpacity }}>SKIP</div>
        <div className="stamp stamp-wish" style={{ opacity: wishOpacity }}>♥ SAVE</div>

        <div className="card-info">
          <span className="brand">{item.brand}</span>
          <h2>{item.name}</h2>
          <div className="card-meta">
            <span>{item.size}</span>
            <span>{item.condition}</span>
            <span className="price">{item.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
