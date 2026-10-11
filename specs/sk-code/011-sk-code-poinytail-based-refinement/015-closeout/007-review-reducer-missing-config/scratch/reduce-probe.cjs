'use strict';
// Reduce every review folder under specs leniently and count the failures by cause.
// Run from the repository root.
const fs = require('node:fs'); const path = require('node:path');
const r = require(path.resolve('.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs'));
const dirs = [];
(function walk(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
  if (e.isSymbolicLink() || !e.isDirectory() || e.name === 'node_modules') continue;
  const p = path.join(dir, e.name); if (fs.existsSync(path.join(p, 'deep-review-state.jsonl'))) dirs.push(p); walk(p); } })('specs');
let errs = 0; const causes = {};
for (const dir of dirs) {
  try { r.reduceReviewState(path.dirname(dir), { write: false, lenient: true, artifactDir: dir }); }
  catch (e) { errs++; const k = String(e && e.message).replace(/\/[^\s'"]+/g, '<p>').replace(/\d+/g, 'N').slice(0, 160); (causes[k] ||= []).push(dir); }
}
console.log(`dirs=${dirs.length} errors=${errs}`);
for (const [k, v] of Object.entries(causes)) console.log(v.length, k, '\n   e.g.', v[0]);
