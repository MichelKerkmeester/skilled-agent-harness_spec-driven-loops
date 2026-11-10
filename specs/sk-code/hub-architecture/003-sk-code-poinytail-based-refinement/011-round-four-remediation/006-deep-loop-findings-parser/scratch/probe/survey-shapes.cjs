'use strict';
// Counts how real iteration narratives under specs/ write their Findings section.
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2] || 'specs';
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue; }
    if (/^iteration-\d+\.md$/.test(e.name) && path.basename(dir) === 'iterations') files.push(p);
  }
})(root);
const c = { files: files.length, withSection: 0, sub: 0, top: 0, indented: 0, fBullet: 0, topAndF: 0, subAndF: 0, indentedOnlyEffect: 0, fOnly: 0 };
const byKind = { research: 0, review: 0, other: 0 };
const perKind = {};
const bump = (k, key) => { perKind[k] = perKind[k] || {}; perKind[k][key] = (perKind[k][key] || 0) + 1; };
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  const h = lines.findIndex((l) => /^##\s+Findings\s*$/i.test(l.trim()));
  if (h < 0) continue;
  c.withSection += 1;
  const kind = /\/review\//.test(f) ? 'review' : /\/research\//.test(f) ? 'research' : 'other';
  byKind[kind] += 1;
  const sec = [];
  for (let i = h + 1; i < lines.length; i += 1) { if (/^##\s+/.test(lines[i].trim())) break; sec.push(lines[i]); }
  const sub = sec.some((l) => /^###\s+\d+\.\s+/.test(l.trim()));
  const top = sec.some((l) => /^\d+\.\s+\S/.test(l));
  const ind = sec.some((l) => /^\s+\d+\.\s+\S/.test(l));
  const fb = sec.some((l) => /^-\s+\*\*F\d+\*\*/.test(l.trim()));
  if (sub) c.sub += 1;
  if (top) c.top += 1;
  if (ind) c.indented += 1;
  if (fb) c.fBullet += 1;
  if (top && fb) c.topAndF += 1;
  if (sub && fb) c.subAndF += 1;
  if (fb && !top && !sub) { c.fOnly += 1; bump(kind, 'fOnly'); }
  if (top) bump(kind, 'top');
  if (sub) bump(kind, 'sub');
  if (!sub && ind) { c.indentedOnlyEffect += 1; bump(kind, 'indentedEffect'); }
}
console.log(JSON.stringify({ ...c, ...byKind }));
console.log(JSON.stringify(perKind));
