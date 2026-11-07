import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, walk, report } from './lib.mjs';

const SITE = join(ROOT, 'site');
const files = walk(SITE, ['.html', '.css', '.scss', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro', '.liquid'], ['styles/tokens.css']);
const errors = [];

const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g;
const PX = /(?<![\w-])(\d+(?:\.\d+)?)px\b/g;

for (const file of files) {
  const rel = relative(ROOT, file);
  const isStyle = /\.(css|scss)$/.test(file);
  let inStyle = isStyle;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/<style[\s>]/.test(line)) inStyle = true;
    const trimmed = line.trim();
    const ignored = trimmed.includes('ds-ignore') || trimmed.startsWith('@media') || trimmed.startsWith('@container');
    if (!ignored) {
      const codeLine = line.replace(/var\([^)]*\)/g, '').replace(/https?:\/\/\S+/g, '').replace(/&#x?[0-9a-fA-F]+;/g, '');
      if (inStyle || /style=/.test(line)) {
        for (const m of codeLine.matchAll(COLOR)) errors.push(`${rel}:${i + 1} цвет вне токенов: ${m[0]}`);
        for (const m of codeLine.matchAll(PX)) {
          if (Number(m[1]) > 1) errors.push(`${rel}:${i + 1} размер вне токенов: ${m[0]}`);
        }
      }
    }
    if (/<\/style>/.test(line) && !isStyle) inStyle = false;
  });
}

process.exit(report('сайт: значения только из tokens.css', errors));
