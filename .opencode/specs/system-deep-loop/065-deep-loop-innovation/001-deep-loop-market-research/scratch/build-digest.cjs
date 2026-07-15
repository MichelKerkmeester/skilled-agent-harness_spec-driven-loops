#!/usr/bin/env node
'use strict';
// Reduces the 216-repo / 222-insight / 134-contradiction registry into an
// authoring-ready synthesis digest. Working aid only (not the deliverable).
const fs = require('fs');
const path = require('path');
const RES = path.join(__dirname, '..', 'research');
const r = JSON.parse(fs.readFileSync(path.join(RES, 'findings-registry.json'), 'utf8'));
const OUT = path.join(__dirname, 'synthesis-digest.md');

const SUB = ['runtime/convergence', 'runtime/state-jsonl-checkpointing', 'runtime/fan-out-fan-in',
  'runtime/dedup-novelty', 'runtime/budget-cost', 'runtime/gauges-observability', 'runtime/locks-recovery',
  'runtime/continuity-threading', 'deep-research', 'deep-review', 'deep-improvement', 'deep-ai-council', 'deep-alignment'];

const repos = Object.values(r.repos);
function starNum(s) { const m = String(s || '').match(/([\d.]+)\s*([kK])?/); if (!m) return 0; return parseFloat(m[1]) * (m[2] ? 1000 : 1); }
const confRank = { high: 0, med: 1, low: 2 };
function byQuality(a, b) { return (confRank[a.confidence] ?? 3) - (confRank[b.confidence] ?? 3) || starNum(b.stars) - starNum(a.stars); }

const lines = [];
lines.push('# Synthesis Digest (authoring aid)\n');
lines.push(`Totals: ${repos.length} repos, ${r.insights.length} insights, ${r.contradictions.length} contradictions.\n`);

// A. Core catalogue candidates: top 5 by quality per PRIMARY subsystem (maps_to[0])
lines.push('\n## A. CORE CATALOGUE CANDIDATES (top 5 per primary subsystem)\n');
for (const s of SUB) {
  const inSub = repos.filter((x) => (x.maps_to || [])[0] === s).sort(byQuality);
  if (!inSub.length) continue;
  lines.push(`\n### ${s}  (${inSub.length} primary)`);
  for (const x of inSub.slice(0, 5)) {
    lines.push(`- **${x.name}** (${x.stars}, ${x.confidence}) — ${x.what || ''}\n  - lesson: ${x.lesson || ''}\n  - url: ${x.url}  | maps: ${(x.maps_to || []).join(', ')}`);
  }
}

// B. Insights per subsystem (top 4 high-conf)
lines.push('\n\n## B. KEY INSIGHTS BY SUBSYSTEM (top 4)\n');
for (const s of SUB) {
  const ins = r.insights.filter((i) => (i.maps_to || []).includes(s)).sort((a, b) => (confRank[a.confidence] ?? 3) - (confRank[b.confidence] ?? 3));
  if (!ins.length) continue;
  lines.push(`\n### ${s}  (${ins.length} insights)`);
  for (const i of ins.slice(0, 4)) lines.push(`- ${i.insight}  _(${i.confidence}; ev: ${(i.evidence || '').slice(0, 60)})_`);
}

// C. Contradictions (deduped, up to 35)
lines.push('\n\n## C. CONTRADICTIONS / TENSIONS (deduped)\n');
const seen = new Set(); let cn = 0;
for (const c of r.contradictions) {
  const k = String(c.claim || '').trim().toLowerCase().slice(0, 50);
  if (!k || seen.has(k)) continue; seen.add(k);
  lines.push(`- **Claim:** ${c.claim}\n  - **Counter:** ${c.counter}  ${c.evidence ? '(ev: ' + String(c.evidence).slice(0, 70) + ')' : ''}`);
  if (++cn >= 35) break;
}

// D. Full repo index (name | stars | conf | url) for appendix + elimination triage
lines.push('\n\n## D. FULL REPO INDEX (' + repos.length + ')\n');
for (const x of repos.slice().sort(byQuality)) lines.push(`- ${x.confidence} | ${x.stars} | ${x.name} | ${x.url} | ${(x.maps_to || []).join(',')}`);

// E. Elimination candidates (low confidence)
lines.push('\n\n## E. ELIMINATION CANDIDATES (low confidence)\n');
for (const x of repos.filter((x) => x.confidence === 'low')) lines.push(`- ${x.name} (${x.url}) — ${x.what || ''} — lesson: ${x.lesson || ''}`);

fs.writeFileSync(OUT, lines.join('\n') + '\n');
console.log('wrote', OUT, '(' + lines.length + ' lines)');
console.log('primary-subsystem repo distribution:');
const dist = {}; for (const x of repos) { const p = (x.maps_to || [])[0] || '(none)'; dist[p] = (dist[p] || 0) + 1; }
for (const s of SUB) if (dist[s]) console.log('  ', s, dist[s]);
