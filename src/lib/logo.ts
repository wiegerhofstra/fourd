// The FourD logo: an isometric, extruded 4 built from three faces (from the original logo SVG).
// Neon style: dark faces outlined by lit edges, frost on the top and side, rose on the front.
// Colours are CSS custom properties (--logo-top, --logo-side, --logo-front, --logo-line, --logo-accent).
export const logoViewBox = { width: 9.893, height: 13.42 };

export const logoFaces = [
  { name: "top", fill: "var(--logo-top)", line: "var(--logo-line)", points: "8.237,7.61 8.237,0.01 0.01,4.76 0.01,6.66 6.592,2.86 6.592,6.66" },
  { name: "side", fill: "var(--logo-side)", line: "var(--logo-line)", points: "8.237,0.01 9.883,0.96 9.883,12.46 8.237,13.41 8.237,9.51 3.301,6.66 4.946,5.71 8.237,7.61" },
  // Drawn last, so the edges it shares with the other faces light up rose.
  { name: "front", fill: "var(--logo-front)", line: "var(--logo-accent)", points: "8.237,13.41 8.237,9.51 3.301,6.66 6.592,4.76 6.592,2.86 0.01,6.66 6.592,10.46 6.592,12.46" },
] as const;
