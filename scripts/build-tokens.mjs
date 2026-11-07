import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadSystem, flatten } from './lib.mjs';

const tokens = flatten(loadSystem());

const fmt = t => {
  if (Array.isArray(t.value)) {
    return t.value.map(f => (/\s/.test(f) && !/^["']/.test(f) ? `"${f}"` : f)).join(', ');
  }
  return String(t.value);
};

const lines = tokens.map(t => `  --${t.path.join('-')}: ${fmt(t)};`);
const css = `/* Generated from visual/visual-system.json by npm run tokens. Do not edit by hand. */\n:root {\n${lines.join('\n')}\n}\n`;

for (const out of ['visual/tokens.css', 'site/styles/tokens.css']) {
  const p = join(ROOT, out);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, css);
}
console.log(`✓ tokens: ${tokens.length} → visual/tokens.css, site/styles/tokens.css`);
