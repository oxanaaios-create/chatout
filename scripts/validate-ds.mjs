import { loadSystem, flatten, group, px, report } from './lib.mjs';

const ds = loadSystem();
const tokens = flatten(ds);
const errors = [];

const sizes = group(tokens, 'font-size');
if (sizes.length < 4 || sizes.length > 5) errors.push(`шкала текста: ${sizes.length} размеров, нужно 4–5`);
for (const t of sizes) {
  const v = px(t.value);
  if (v !== null && v < 14) errors.push(`${t.path.join('.')}: ${v}px меньше минимума 14px`);
}

for (const t of tokens.filter(t => t.type === 'dimension')) {
  const v = px(t.value);
  if (v === null) continue;
  if (v !== 1 && v % 2 !== 0) errors.push(`${t.path.join('.')}: ${t.value} не кратно 2px`);
}

const radii = group(tokens, 'radius');
if (radii.length > 3) errors.push(`радиусов ${radii.length}, максимум 3`);

const space = group(tokens, 'space');
if (space.length > 10) errors.push(`шагов отступа ${space.length}, максимум 10`);

const families = group(tokens, 'font-family');
if (families.length > 2) errors.push(`гарнитур ${families.length}, максимум 2`);

const weights = group(tokens, 'font-weight');
if (weights.length > 3) errors.push(`начертаний ${weights.length}, максимум 3`);

const shadows = group(tokens, 'shadow');
if (shadows.length > 2) errors.push(`теней ${shadows.length}, максимум 2`);

const colors = Object.fromEntries(group(tokens, 'color').map(t => [t.path.slice(1).join('-'), t.value]));
const lum = hex => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
for (const [fg, bg, kind = 'text'] of ds.$extensions?.['kit.contrast'] ?? []) {
  if (!colors[fg] || !colors[bg]) { errors.push(`контраст: нет цвета ${!colors[fg] ? fg : bg}`); continue; }
  const r = ratio(colors[fg], colors[bg]);
  const min = kind === 'large' ? 3 : 4.5;
  if (r < min) errors.push(`контраст ${fg} на ${bg}: ${r.toFixed(2)}:1, нужно ≥ ${min}:1`);
}

process.exit(report('дизайн-система', errors));
