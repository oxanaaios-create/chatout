import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, report } from './lib.mjs';

const files = ['docs/plan.md'].map(f => join(ROOT, f)).filter(existsSync);
const errors = [];
const EMPTY = /^(|—|-|tbd|todo|\.\.\.|…|\[data needed\])$/i;

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let col = -1;
  lines.forEach((line, i) => {
    if (!line.trim().startsWith('|')) { col = -1; return; }
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    if (cells.every(c => /^:?-+:?$/.test(c))) return;
    const idx = cells.findIndex(c => /критери|acceptance/i.test(c));
    if (idx !== -1 && col === -1) { col = idx; return; }
    if (col === -1) return;
    const task = cells[1] ?? cells[0];
    if (EMPTY.test(cells[col] ?? '')) errors.push(`docs/plan.md:${i + 1} «${task}» без критерия приёмки`);
  });
}

process.exit(report('задачи с критериями приёмки', errors));
