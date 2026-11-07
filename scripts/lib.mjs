import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DS_PATH = join(ROOT, 'visual', 'visual-system.json');

export function loadSystem() {
  return JSON.parse(readFileSync(DS_PATH, 'utf8'));
}

export function flatten(node, path = [], type, out = []) {
  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith('$') || val === null || typeof val !== 'object') continue;
    const t = val.$type || type;
    if ('$value' in val) out.push({ path: [...path, key], type: t, value: val.$value });
    else flatten(val, [...path, key], t, out);
  }
  return out;
}

export function group(tokens, name) {
  return tokens.filter(t => t.path[0] === name);
}

export function px(v) {
  const m = /^(-?\d+(?:\.\d+)?)px$/.exec(String(v).trim());
  return m ? Number(m[1]) : null;
}

export function today() {
  const d = new Date();
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function walk(dir, exts, skip = []) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (skip.some(s => p.endsWith(s)) || name === 'node_modules' || name.startsWith('.')) continue;
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p, exts, skip));
    else if (exts.some(e => name.endsWith(e))) out.push(p);
  }
  return out;
}

export function report(title, errors) {
  if (errors.length) {
    console.error(`✗ ${title}: ${errors.length}`);
    for (const e of errors) console.error(`  - ${e}`);
    return 1;
  }
  console.log(`✓ ${title}`);
  return 0;
}
