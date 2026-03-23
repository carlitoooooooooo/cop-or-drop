import { useEffect, useRef } from "react";
import { PixelUFO, PixelAlien, PixelInvader, PixelRocket, PixelStar, PixelMoon } from "./PixelSprites";
import "./SpaceBackground.css";

const FLOATERS = [
  { Sprite: PixelUFO,     scale: 4,  x: 8,   y: 10, dur: 28, delay: 0   },
  { Sprite: PixelAlien,   scale: 3,  x: 75,  y: 22, dur: 34, delay: -8  },
  { Sprite: PixelUFO,     scale: 6,  x: 40,  y: 58, dur: 22, delay: -4  },
  { Sprite: PixelInvader, scale: 3,  x: 62,  y: 75, dur: 30, delay: -12 },
  { Sprite: PixelAlien,   scale: 5,  x: 18,  y: 82, dur: 38, delay: -6  },
  { Sprite: PixelRocket,  scale: 3,  x: 88,  y: 38, dur: 26, delay: -2  },
  { Sprite: PixelInvader, scale: 4,  x: 52,  y: 14, dur: 32, delay: -16 },
  { Sprite: PixelUFO,     scale: 3,  x: 30,  y: 45, dur: 20, delay: -10 },
  { Sprite: PixelMoon,    scale: 4,  x: 85,  y: 70, dur: 50, delay: -20 },
  { Sprite: PixelStar,    scale: 3,  x: 5,   y: 55, dur: 18, delay: -5  },
];

export default function SpaceBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;

    const layers = [
      { count: 120, speed: 0.01, size: 0.8, alpha: 0.5 },
      { count: 60,  speed: 0.03, size: 1.4, alpha: 0.7 },
      { count: 25,  speed: 0.06, size: 2.0, alpha: 0.9 },
    ];
    let stars = [];
    let shooters = [];
    let shootTimer = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: layer.size + Math.random() * 0.6,
            speed: layer.speed,
            alpha: layer.alpha * (0.6 + Math.random() * 0.4),
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.02 + Math.random() * 0.03,
          });
        }
      });
    };

    const spawnShooter = () => {
      const angle = (Math.random() * 30 + 10) * (Math.PI / 180);
      shooters.push({
        x: Math.random() * width * 0.7,
        y: 0,
        vx: Math.cos(angle) * 12,
        vy: Math.sin(angle) * 12,
        len: 80 + Math.random() * 80,
        life: 1,
      });
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const grad = ctx.createRadialGradient(
        width * 0.4, height * 0.3, 0,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.9
      );
      grad.addColorStop(0,   "#0d0630");
      grad.addColorStop(0.3, "#050120");
      grad.addColorStop(0.7, "#020010");
      grad.addColorStop(1,   "#000005");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Nebula
      const nebula = (cx, cy, r, color) => {
        const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        ng.addColorStop(0, color);
        ng.addColorStop(1, "transparent");
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.55, 0.4, 0, Math.PI * 2);
        ctx.fill();
      };
      nebula(width * 0.2,  height * 0.25, width * 0.35, "rgba(80,20,120,0.18)");
      nebula(width * 0.75, height * 0.6,  width * 0.30, "rgba(20,50,140,0.15)");
      nebula(width * 0.55, height * 0.15, width * 0.20, "rgba(140,20,80,0.10)");

      // Stars
      stars.forEach(s => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset);
        ctx.globalAlpha = s.alpha * (0.4 + 0.6 * twinkle);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (0.8 + 0.2 * twinkle), 0, Math.PI * 2);
        ctx.fill();
        if (s.size > 1.6) {
          ctx.globalAlpha = s.alpha * 0.15 * twinkle;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        s.y += s.speed;
        if (s.y > height) { s.y = 0; s.x = Math.random() * width; }
      });

      // Shooting stars
      shootTimer += 0.016;
      if (shootTimer > 3 + Math.random() * 4) { spawnShooter(); shootTimer = 0; }
      shooters = shooters.filter(s => s.life > 0);
      shooters.forEach(s => {
        ctx.globalAlpha = s.life;
        const sg = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * (s.len / 12), s.y - s.vy * (s.len / 12));
        sg.addColorStop(0, "rgba(255,255,255,0.9)");
        sg.addColorStop(1, "transparent");
        ctx.strokeStyle = sg;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * (s.len / 12), s.y - s.vy * (s.len / 12));
        ctx.stroke();
        s.x += s.vx; s.y += s.vy; s.life -= 0.025;
        if (s.x > width || s.y > height) s.life = 0;
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="space-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="space-canvas" />
      {FLOATERS.map(({ Sprite, scale, x, y, dur, delay }, i) => (
        <div
          key={i}
          className="floater"
          style={{
            left: `${x}vw`,
            top:  `${y}vh`,
            "--dur":   `${dur}s`,
            "--delay": `${delay}s`,
          }}
        >
          <Sprite scale={scale} />
        </div>
      ))}
    </div>
  );
}
