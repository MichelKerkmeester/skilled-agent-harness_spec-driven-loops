// Summarize a validate-all.cjs JSONL: pass counts and per-rule failing-packet
// counts, split active vs archived. Usage: node agg.cjs <file.jsonl> [label]
const fs = require('node:fs');
const [file, label = file] = process.argv.slice(2);
const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const bucket = (name, list) => {
  const readable = list.filter((r) => !r.unreadable);
  const pass = readable.filter((r) => r.errors === 0).length;
  const byRule = {};
  for (const r of readable) for (const rule of new Set(r.failing)) byRule[rule] = (byRule[rule] || 0) + 1;
  const errs = readable.reduce((s, r) => s + r.errors, 0);
  console.log(`  ${name}: packets=${list.length} unreadable=${list.length - readable.length} pass=${pass} fail=${readable.length - pass} errorRulesTotal=${errs}`);
  for (const [rule, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) console.log(`      ${String(n).padStart(5)}  ${rule}`);
};
console.log(`== ${label}`);
bucket('active  ', rows.filter((r) => !r.archived));
bucket('archived', rows.filter((r) => r.archived));
