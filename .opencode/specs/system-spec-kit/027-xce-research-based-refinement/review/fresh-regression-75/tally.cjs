#!/usr/bin/env node
'use strict';
// Summarize the 027 fresh-regression-75 review: seat progress + findings by severity/lineage/model.
// Usage: node tally.cjs [--list] [--sev P0,P1] [--json]
const fs = require('node:fs');
const path = require('node:path');
const RT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75';
const has = (f) => process.argv.includes(f);
const optVal = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };

const manifest = require(path.join(RT, 'manifest.json'));
const isDone = (s) => fs.existsSync(path.join(s.lineageDir, 'iterations', `iteration-${String(s.iter).padStart(3, '0')}.md`));
const isFailed = (s) => fs.existsSync(path.join(s.lineageDir, 'raw', `iter-${s.iter}.FAILED`));

let done = 0; let pending = 0; let failed = 0;
const findings = [];
const seen = new Set();
for (const s of manifest) {
  if (isDone(s)) done += 1; else { pending += 1; if (isFailed(s)) failed += 1; }
  const delta = path.join(s.lineageDir, 'deltas', `iter-${s.iter}.jsonl`);
  if (!fs.existsSync(delta)) continue;
  for (const line of fs.readFileSync(delta, 'utf8').split(/\r?\n/)) {
    const t = line.trim(); if (!t) continue;
    let o; try { o = JSON.parse(t); } catch { continue; }
    if (o && o.type === 'finding') {
      if (seen.has(o.id)) continue; seen.add(o.id);
      findings.push({ id: o.id, sev: o.severity, dim: o.dimension, label: s.label, model: o.model, file: o.file, title: o.title });
    }
  }
}

const bySev = { P0: 0, P1: 0, P2: 0 };
const byLineage = {}; const byModel = {}; const byDim = {};
for (const f of findings) {
  bySev[f.sev] = (bySev[f.sev] || 0) + 1;
  byLineage[f.label] = (byLineage[f.label] || 0) + 1;
  byModel[f.model] = (byModel[f.model] || 0) + 1;
  byDim[f.dim] = (byDim[f.dim] || 0) + 1;
}

if (has('--json')) { console.log(JSON.stringify({ seats: { total: manifest.length, done, pending, failed }, bySev, byLineage, byModel, byDim, findings }, null, 2)); process.exit(0); }

console.log(`SEATS: ${done}/${manifest.length} done · ${pending} pending · ${failed} failed-awaiting-retry`);
console.log(`FINDINGS: total=${findings.length}  P0=${bySev.P0} P1=${bySev.P1} P2=${bySev.P2}`);
console.log(`by model: ${Object.entries(byModel).map(([k, v]) => `${k}=${v}`).join('  ')}`);
console.log(`by dimension: ${Object.entries(byDim).map(([k, v]) => `${k}=${v}`).join('  ')}`);
console.log('by lineage:'); for (const [k, v] of Object.entries(byLineage).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(2)} ${k}`);

if (has('--list')) {
  const sevFilter = optVal('--sev', 'P0,P1,P2').split(',');
  console.log('\nFINDINGS LIST:');
  for (const f of findings.filter((x) => sevFilter.includes(x.sev)).sort((a, b) => a.sev.localeCompare(b.sev))) {
    console.log(`  [${f.sev}] ${f.id} · ${f.file}\n        ${f.title}`);
  }
}
