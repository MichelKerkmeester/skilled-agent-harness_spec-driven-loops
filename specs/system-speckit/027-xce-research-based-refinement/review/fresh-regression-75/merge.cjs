#!/usr/bin/env node
'use strict';
// Reduce all seat deltas into a deduped findings registry with cross-model attribution,
// and emit a Round-2 P1 worklist. Operates on the canonical {type:"finding"} delta rows.
const fs = require('node:fs');
const path = require('node:path');
const RT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75';
const manifest = require(path.join(RT, 'manifest.json'));

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const fileBase = (f) => String(f || '').split(/[\\/]/).pop().split(':')[0];

const all = [];
for (const s of manifest) {
  const d = path.join(s.lineageDir, 'deltas', `iter-${s.iter}.jsonl`);
  if (!fs.existsSync(d)) continue;
  for (const line of fs.readFileSync(d, 'utf8').split(/\r?\n/)) {
    const t = line.trim(); if (!t) continue;
    let o; try { o = JSON.parse(t); } catch { continue; }
    if (o && o.type === 'finding') all.push({ ...o, _seat: s.label });
  }
}

// Dedup heuristic: same cited file (basename) + first 6 normalized title words.
const groups = new Map();
for (const f of all) {
  // Same exact file:line => same issue (merge cross-model). Else fall back to basename+title-prefix.
  const key = (f.file && /:\d/.test(f.file)) ? `F:${f.file}` : `${fileBase(f.file)}::${norm(f.title).split(' ').slice(0, 6).join(' ')}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(f);
}
const sevRank = { P0: 0, P1: 1, P2: 2 };
const unique = [];
for (const [, fs_] of groups) {
  fs_.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);
  const lead = fs_[0];
  unique.push({
    id: lead.id,
    severity: lead.severity,
    dimension: lead.dimension,
    file: lead.file,
    title: lead.title,
    detail: (lead.findingDetails && lead.findingDetails[0]) || {},
    corroboration: fs_.length,
    models: [...new Set(fs_.map((x) => x.model))],
    seats: [...new Set(fs_.map((x) => x._seat))],
    allIds: fs_.map((x) => x.id),
  });
}
unique.sort((a, b) => sevRank[a.severity] - sevRank[b.severity] || b.corroboration - a.corroboration);

const totals = { P0: 0, P1: 0, P2: 0 }; unique.forEach((u) => { totals[u.severity] += 1; });
const rawTotals = { P0: 0, P1: 0, P2: 0 }; all.forEach((f) => { rawTotals[f.severity] += 1; });
const stamp = process.argv[2] || 'unstamped';

fs.writeFileSync(path.join(RT, 'deep-review-findings-registry.json'), JSON.stringify({
  generatedAt: stamp, round: 'fresh-regression-75', reviewTarget: 'system-spec-kit/027-xce-research-based-refinement',
  rawFindings: all.length, rawTotals, uniqueFindings: unique.length, totals, findings: unique,
}, null, 2));

const p1 = unique.filter((u) => u.severity === 'P1');
fs.writeFileSync(path.join(RT, 'round2-p1-worklist.json'), JSON.stringify(p1, null, 2));

console.log(`raw=${all.length} (P0=${rawTotals.P0} P1=${rawTotals.P1} P2=${rawTotals.P2}) -> unique=${unique.length} (P0=${totals.P0} P1=${totals.P1} P2=${totals.P2})`);
console.log(`cross-model corroborated (>=2 seats): ${unique.filter((u) => u.corroboration >= 2).length}`);
console.log(`Round-2 P1 worklist: ${p1.length}`);
