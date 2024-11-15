export const name = "randomColorGenerator";

const golden_ratio_conjugate = 0.618033988749895;

// HSV values in [0..1[
// Returns [r, g, b] values ranging from 0 to 255
function hsvToRgb(h, s, v) {
  let h_i = Math.floor(h * 6);
  let f = h * 6 - h_i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  let r, g, b;
  if (h_i === 0) {
    r = v;
    g = t;
    b = p;
  } else if (h_i === 1) {
    r = q;
    g = v;
    b = p;
  } else if (h_i === 2) {
    r = p;
    g = v;
    b = t;
  } else if (h_i === 3) {
    r = p;
    g = q;
    b = v;
  } else if (h_i === 4) {
    r = t;
    g = p;
    b = v;
  } else if (h_i === 5) {
    r = v;
    g = p;
    b = q;
  }

  return [Math.floor(r * 256), Math.floor(g * 256), Math.floor(b * 256)];
}

export function getRandomColor() {
  let seed = Math.random();
  seed += golden_ratio_conjugate;
  seed %= 1;
  const [r, g, b ] = hsvToRgb(seed, 0.99, 0.99);
  return `rgb(${r}, ${g}, ${b})`;
}
