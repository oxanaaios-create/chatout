import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, today, walk } from './lib.mjs';
import { ensureDevlog } from './devlog.mjs';

const [name, type = 'commission'] = process.argv.slice(2);
if (!name || !['concept', 'commission'].includes(type)) {
  console.error('Использование: npm run init -- "Название проекта" concept|commission');
  process.exit(1);
}

const date = today();
const typeLabel = type === 'concept'
  ? `Концепт (Unofficial concept, not affiliated with ${name})`
  : 'Заказ клиента';

const files = walk(ROOT, ['.md', '.html', '.json'], ['docs/devlog/_template.md', 'node_modules']);
let changed = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const out = src
    .replaceAll('{{PROJECT_NAME}}', name)
    .replaceAll('{{PROJECT_TYPE}}', typeLabel)
    .replaceAll('{{START_DATE}}', date);
  if (out !== src) { writeFileSync(f, out); changed++; }
}

const pkg = join(ROOT, 'package.json');
const json = JSON.parse(readFileSync(pkg, 'utf8'));
json.name = name.toLowerCase().normalize('NFKD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') + '-site';
writeFileSync(pkg, JSON.stringify(json, null, 2) + '\n');

ensureDevlog(date);
console.log(`✓ проект «${name}» (${type}): обновлено файлов ${changed}`);
