import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { ROOT, today } from './lib.mjs';
import { ensureDevlog } from './devlog.mjs';

const summary = process.argv.slice(2).join(' ').trim();
if (!summary) {
  console.error('Нужен итог дня: npm run day -- "что сделано одной строкой"');
  process.exit(1);
}

const run = cmd => execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
const date = today();
const file = ensureDevlog(date);

const log = readFileSync(file, 'utf8');
if (log.includes('[одна строка]')) writeFileSync(file, log.replace('[одна строка]', summary));

run('npm run --silent check');
run('git add -A');

const staged = execSync('git diff --cached --name-only', { cwd: ROOT }).toString().trim();
if (!staged) {
  console.log('• нечего коммитить');
  process.exit(0);
}
const msg = `day: ${date} — ${summary}`.replace(/"/g, '\\"');
run(`git commit -m "${msg}"`);

try {
  run('git push');
} catch {
  console.error('✗ push не прошёл: коммит сохранён локально, повтори git push');
  process.exit(1);
}
