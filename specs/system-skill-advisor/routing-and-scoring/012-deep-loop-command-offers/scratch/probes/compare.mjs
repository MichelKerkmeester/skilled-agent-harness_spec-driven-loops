import { readFileSync } from 'node:fs';
const [, , ...pairs] = process.argv;
const guarded = new Set([...Array.from({ length: 15 }, (_, i) => `N${i + 1}`), 'H3a', 'H4', 'H5']);
let failures = 0;
let changes = 0;
for (let i = 0; i < pairs.length; i += 2) {
  const before = new Map(JSON.parse(readFileSync(pairs[i], 'utf8')).map((r) => [r.id, r]));
  for (const row of JSON.parse(readFileSync(pairs[i + 1], 'utf8'))) {
    const old = before.get(row.id);
    const key = (r) => `${r?.top?.skill ?? 'NONE'} cmd=${r?.top?.command ?? '-'} pol=${r?.top?.policy ?? '-'}`;
    if (!old) { console.log(`${row.id}: no baseline row`); continue; }
    if (key(old) !== key(row)) {
      changes += 1;
      const bad = guarded.has(row.id);
      if (bad) failures += 1;
      console.log(`${bad ? 'FAIL ' : 'CHANGE '}${row.id}: ${key(old)} -> ${key(row)}`);
    }
  }
}
console.log(`changes=${changes} guarded_failures=${failures}`);
