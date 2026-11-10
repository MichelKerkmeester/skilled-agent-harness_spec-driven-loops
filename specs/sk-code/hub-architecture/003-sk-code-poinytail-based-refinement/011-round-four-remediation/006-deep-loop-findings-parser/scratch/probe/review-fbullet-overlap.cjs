'use strict';
// For review iterations that write F### bullets, checks whether the same run also has
// delta finding rows or findingDetails, and whether their ids match the bullet ids.
const fs = require('node:fs');
const path = require('node:path');
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue; }
    if (/^iteration-\d+\.md$/.test(e.name) && path.basename(dir) === 'iterations') files.push(p);
  }
})(process.argv[2] || 'specs');
const out = { fRuns: 0, withDeltaRows: 0, withDetails: 0, idsAllMatch: 0, idsDiffer: 0 };
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const fIds = [...text.matchAll(/^\s*-\s+\*\*(F\d+)\*\*/gm)].map((m) => m[1]);
  if (fIds.length === 0) continue;
  out.fRuns += 1;
  const run = Number(path.basename(f).match(/\d+/)[0]);
  const loopDir = path.dirname(path.dirname(f));
  const deltaPath = path.join(loopDir, 'deltas', `iter-${String(run).padStart(3, '0')}.jsonl`);
  const ids = new Set();
  let rows = 0;
  let details = 0;
  const readJsonl = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : []);
  for (const r of readJsonl(deltaPath)) {
    if (r.type === 'finding') { rows += 1; if (r.id) ids.add(r.id); }
    if (r.type === 'iteration' && Array.isArray(r.findingDetails) && r.findingDetails.length) { details += 1; r.findingDetails.forEach((d) => d && (d.id || d.findingId) && ids.add(d.id || d.findingId)); }
  }
  for (const name of fs.readdirSync(loopDir)) {
    if (!/state\.jsonl$/.test(name)) continue;
    for (const r of readJsonl(path.join(loopDir, name))) {
      if (r.type === 'iteration' && Number(r.run ?? r.iteration) === run && Array.isArray(r.findingDetails) && r.findingDetails.length) { details += 1; r.findingDetails.forEach((d) => d && (d.id || d.findingId) && ids.add(d.id || d.findingId)); }
    }
  }
  if (rows) out.withDeltaRows += 1;
  if (details) out.withDetails += 1;
  if (rows || details) { if (fIds.every((id) => ids.has(id))) out.idsAllMatch += 1; else out.idsDiffer += 1; }
}
console.log(JSON.stringify(out));
