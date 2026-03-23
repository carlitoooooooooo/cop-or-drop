// Pixel art sprites as SVG pixel grids
// Each sprite is drawn as a grid of colored rects on a small canvas, then scaled up

const px = (grid, palette, scale = 3) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const rects = [];
  grid.forEach((row, y) => {
    [...row].forEach((code, x) => {
      if (code === "." || code === " ") return;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[code]} />
      );
    });
  });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${cols} ${rows}`}
      width={cols * scale}
      height={rows * scale}
      style={{ imageRendering: "pixelated", display: "block" }}
      shapeRendering="crispEdges"
    >
      {rects}
    </svg>
  );
};

export const PixelUFO = ({ scale = 3 }) => px(
  [
    "......BBBB......",
    "....BBBBBBBB....",
    "..SSSSSSSSSSSSS.",
    ".SSSLLSLSLSSSSSS",
    "SSSSLLLLLLSSSSSS",
    ".SSSLLSLSLSSSSSS",
    "..SSSSSSSSSSSSS.",
    "....BBBBBBBB....",
    "......BBBB......",
  ],
  { S: "#c0c0c0", B: "#888888", L: "#00ffff" },
  scale
);

export const PixelAlien = ({ scale = 3 }) => px(
  [
    "..G..........G..",
    "...GG.....GG...",
    "..GGGGGGGGGGG..",
    ".GGGWGGGGWGGGGG.",
    "GGGGGGGGGGGGGGG",
    "GGGPGGPGGPGGGGG",
    ".GGGPPPPPPPGGG.",
    "..GG..GGG..GG..",
    ".G..GG...GG..G.",
  ],
  { G: "#00cc44", W: "#ffffff", P: "#006622" },
  scale
);

export const PixelInvader = ({ scale = 3 }) => px(
  [
    "..P......P..",
    "...P....P...",
    "..PPPPPPPP..",
    ".PP.PPPP.PP.",
    "PPPPPPPPPPPP",
    "P.PPPPPPPP.P",
    "P.P......P.P",
    "...PP..PP...",
  ],
  { P: "#ff66cc" },
  scale
);

export const PixelRocket = ({ scale = 3 }) => px(
  [
    "....RR....",
    "...RRRR...",
    "..RRRRRR..",
    ".RRWWWWRR.",
    ".RRWWWWRR.",
    ".RRWWWWRR.",
    "RRRRRRRRRRR",
    "YRRRRRRRRRY",
    "YY.RRRRR.YY",
    "...RRRRR...",
    "...R...R...",
  ],
  { R: "#dddddd", W: "#88ddff", Y: "#ffaa00" },
  scale
);

export const PixelStar = ({ scale = 2 }) => px(
  [
    "..Y..",
    "..Y..",
    "YYYYY",
    "..Y..",
    "..Y..",
  ],
  { Y: "#ffff00" },
  scale
);

export const PixelMoon = ({ scale = 3 }) => px(
  [
    ".WW..",
    "W..W.",
    "W.D..",
    "W..D.",
    ".WW..",
  ],
  { W: "#eeeecc", D: "#cccc99" },
  scale
);
