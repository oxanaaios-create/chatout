import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, today } from './lib.mjs';

export function ensureDevlog(date = today()) {
  const file = join(ROOT, 'docs', 'devlog', `${date}.md`);
  if (!existsSync(file)) {
    const tpl = readFileSync(join(ROOT, 'docs', 'devlog', '_template.md'), 'utf8');
    writeFileSync(file, tpl.replaceAll('{{DATE}}', date));
    console.log(`✓ создан docs/devlog/${date}.md`);
  } else {
    console.log(`• docs/devlog/${date}.md уже есть`);
  }
  return file;
}

if (import.meta.url === `file://${process.argv[1]}`) ensureDevlog(process.argv[2]);
