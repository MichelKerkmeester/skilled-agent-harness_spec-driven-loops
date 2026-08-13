#!/usr/bin/env node
'use strict';
// Reduce the per-mode (run-2) findings registry into a synthesis-ready digest,
// grouped by deep-loop mode with the uniqueness/moat field surfaced per rec.
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'research');
const reg = JSON.parse(fs.readFileSync(path.join(DIR, 'findings-registry-modes.json'), 'utf8'));
const state = fs.readFileSync(path.join(DIR, 'deep-research-state-modes.jsonl'), 'utf8').split('\n').filter(Boolean).map(JSON.parse);

const MODE_ORDER = ['deep-research', 'deep-review', 'deep-ai-council', 'deep-improvement', 'deep-alignment', 'agent-improvement', 'model-benchmark', 'skill-benchmark'];
const repos = Object.values(reg.repos);
const IMP = { high: 0, med: 1, low: 2 };
const EFF = { S: 0, M: 1, L: 2 };
const rank = (r) => (IMP[r.impact] ?? 3) * 3 + (EFF[r.effort] ?? 3); // high/S first

function groupBy(arr, keyFn) {
  const m = {};
  for (const x of arr) { const k = keyFn(x); (m[k] = m[k] || []).push(x); }
  return m;
}

const out = [];
out.push('# 005 run-2 Per-Mode Synthesis Digest\n');
out.push(`iterations: ${state.length}; new repos: ${repos.length}; insights: ${reg.insights.length}; recommendations: ${reg.recommendations.length}; contradictions: ${reg.contradictions.length}\n`);

const recsByMode = groupBy(reg.recommendations, (x) => x.mode || 'unmapped');
const reposByMode = groupBy(repos, (x) => x.mode || 'unmapped');
const insByMode = groupBy(reg.insights, (x) => x.mode || 'unmapped');
const contraByMode = groupBy(reg.contradictions, (x) => x.mode || 'unmapped');

for (const mode of MODE_ORDER) {
  const recs = (recsByMode[mode] || []).slice().sort((a, b) => rank(a) - rank(b));
  const rp = reposByMode[mode] || [];
  const ins = insByMode[mode] || [];
  const ct = contraByMode[mode] || [];
  out.push(`\n\n---\n\n## ${mode}`);
  out.push(`_${recs.length} recs · ${rp.length} repos · ${ins.length} insights · ${ct.length} contradictions_\n`);

  out.push(`\n### Recommendations (ranked impact×effort)`);
  for (const r of recs) {
    out.push(`- **[${r.impact}/${r.effort}]** ${r.rec}`);
    if (r.uniqueness && r.uniqueness.trim()) out.push(`  - _moat:_ ${r.uniqueness}`);
    if (r.evidence) out.push(`  - _ev:_ ${r.evidence} (iter ${r.iter}, ${r.angle || ''})`);
  }

  out.push(`\n### Key repos / mechanisms`);
  for (const r of rp) out.push(`- **${r.name}** <${r.url}> [${r.confidence}] — ${r.lesson || r.what || ''}`);

  out.push(`\n### Insights`);
  for (const i of ins) out.push(`- ${i.insight} _(ev: ${i.evidence || 'n/a'}, ${i.confidence})_`);

  if (ct.length) {
    out.push(`\n### Contradictions / tensions`);
    for (const c of ct) out.push(`- **${c.claim}** vs ${c.counter} _(ev: ${c.evidence || 'n/a'})_`);
  }
}

// Per-mode coverage stats
out.push('\n\n---\n\n## Per-mode coverage\n');
const byMode = groupBy(state, (s) => s.mode);
for (const mode of MODE_ORDER) {
  const list = byMode[mode] || [];
  out.push(`- **${mode}**: ${list.length}/5 iters, ${list.reduce((a, s) => a + s.new_repos, 0)} repos, ${list.reduce((a, s) => a + s.recs, 0)} recs`);
}

fs.writeFileSync(path.join(__dirname, 'synthesis-digest-modes.md'), out.join('\n') + '\n');
console.log('wrote synthesis-digest-modes.md:', out.join('\n').length, 'chars');
