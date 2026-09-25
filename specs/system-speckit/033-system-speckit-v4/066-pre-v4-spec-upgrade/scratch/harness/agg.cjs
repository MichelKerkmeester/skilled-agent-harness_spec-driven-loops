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
// v4 treats a folder as a packet only when its name is NNN-slug and no folder
// on its path starts with a dot (the graph backfill's own discovery rule). The
// walker in validate-all.cjs is looser, so folders that merely hold a spec.md
// are reported apart instead of being counted as packets.
const SPEC_FOLDER_RE = /^\d{3}(?:[-_].+)?$/;
const isPacket = (r) => {
  const segments = r.folder.split('/');
  return segments.every((segment) => !segment.startsWith('.')) && SPEC_FOLDER_RE.test(segments[segments.length - 1]);
};
console.log(`== ${label}`);
bucket('active  ', rows.filter((r) => !r.archived && isPacket(r)));
bucket('archived', rows.filter((r) => r.archived && isPacket(r)));
const others = rows.filter((r) => !isPacket(r));
bucket('not v4 packets (spec.md only)', others);
for (const r of others) console.log(`      ${r.archived ? 'archived' : 'active  '}  ${r.folder}`);
