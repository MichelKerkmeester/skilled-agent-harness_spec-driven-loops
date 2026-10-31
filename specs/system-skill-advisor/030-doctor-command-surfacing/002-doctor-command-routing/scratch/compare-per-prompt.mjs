// Per-prompt comparison for gate G11. Reads a baseline snapshot and a current
// snapshot written by per-prompt-snapshot.mjs and lists every row that passed in
// the baseline and fails now. Exit 1 when any row was lost, exit 0 otherwise.
// Rows are matched by corpus name plus prompt text, so a reordered corpus still
// compares correctly.
//
// Usage: node compare-per-prompt.mjs <baseline.json> <current.json>

import { readFileSync } from 'node:fs';

const [baselinePath, currentPath] = process.argv.slice(2);
if (!baselinePath || !currentPath) {
  console.error('usage: node compare-per-prompt.mjs <baseline.json> <current.json>');
  process.exit(2);
}
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const current = JSON.parse(readFileSync(currentPath, 'utf8'));

const lost = [];
const gained = [];
const missing = [];
for (const [corpus, rows] of Object.entries(baseline.rows)) {
  const now = new Map((current.rows[corpus] ?? []).map((r) => [r.prompt, r]));
  for (const row of rows) {
    const match = now.get(row.prompt);
    if (!match) {
      missing.push({ corpus, prompt: row.prompt });
      continue;
    }
    if (row.pass && !match.pass) lost.push({ corpus, prompt: row.prompt, gold: row.gold, before: row.top, after: match.top });
    if (!row.pass && match.pass) gained.push({ corpus, prompt: row.prompt, gold: row.gold, before: row.top, after: match.top });
  }
}

console.log(JSON.stringify({
  baselineHead: baseline.head,
  currentHead: current.head,
  baselineTotals: baseline.totals,
  currentTotals: current.totals,
  lost: lost.length,
  gained: gained.length,
  missing: missing.length,
  lostRows: lost,
  gainedRows: gained,
  missingRows: missing,
}, null, 1));
process.exit(lost.length > 0 || missing.length > 0 ? 1 : 0);
