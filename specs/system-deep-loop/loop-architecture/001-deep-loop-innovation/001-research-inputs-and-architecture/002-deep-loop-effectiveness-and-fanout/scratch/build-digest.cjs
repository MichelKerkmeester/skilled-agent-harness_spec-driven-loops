#!/usr/bin/env node
'use strict';
// Reduce the 005 findings registry into a synthesis-ready digest for research.md.
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'research');
const reg = JSON.parse(fs.readFileSync(path.join(DIR, 'findings-registry.json'), 'utf8'));
const state = fs.readFileSync(path.join(DIR, 'deep-research-state.jsonl'), 'utf8').split('\n').filter(Boolean).map(JSON.parse);

const repos = Object.values(reg.repos);
const primary = (x) => (x.maps_to && x.maps_to[0]) || 'unmapped';

// group helper
function groupBy(arr, keyFn) {
  const m = {};
  for (const x of arr) { const k = keyFn(x); (m[k] = m[k] || []).push(x); }
  return m;
}

const out = [];
out.push('# 005 Synthesis Digest\n');
out.push(`iterations: ${state.length}; new repos: ${repos.length}; insights: ${reg.insights.length}; recommendations: ${reg.recommendations.length}; contradictions: ${reg.contradictions.length}\n`);

// A: repos by primary subsystem
out.push('\n## A. New repos by primary subsystem\n');
const byemsub = groupBy(repos, primary);
for (const [sub, list] of Object.entries(byemsub).sort((a, b) => b[1].length - a[1].length)) {
  out.push(`\n### ${sub} (${list.length})`);
  for (const r of list) out.push(`- **${r.name}** <${r.url}> [${r.confidence}] — ${r.lesson || r.what || ''}`);
}

// B: recommendations by target (the headline deliverable)
out.push('\n\n## B. Recommendations by target\n');
const byTarget = groupBy(reg.recommendations, (x) => (x.target || 'unmapped').split('/')[0] + (/(council|review|improvement|alignment|research)/.test(x.target || '') ? '' : ''));
const byTgt = groupBy(reg.recommendations, (x) => x.target || 'unmapped');
for (const [tgt, list] of Object.entries(byTgt).sort((a, b) => b[1].length - a[1].length)) {
  out.push(`\n### ${tgt} (${list.length})`);
  for (const r of list) out.push(`- [I:${r.impact}/E:${r.effort}] ${r.rec}  _(iter ${r.iter})_`);
}

// C: contradictions
out.push('\n\n## C. Contradictions / tensions\n');
for (const c of reg.contradictions) out.push(`- **${c.claim}** vs ${c.counter} _(ev: ${c.evidence || 'n/a'})_`);

// D: insights by subsystem
out.push('\n\n## D. Insights by primary subsystem\n');
const insBySub = groupBy(reg.insights, primary);
for (const [sub, list] of Object.entries(insBySub).sort((a, b) => b[1].length - a[1].length)) {
  out.push(`\n### ${sub} (${list.length})`);
  for (const i of list) out.push(`- ${i.insight} _(ev: ${i.evidence || 'n/a'}, ${i.confidence})_`);
}

// E: per-thread stats
out.push('\n\n## E. Per-thread coverage\n');
const byThread = groupBy(state, (s) => s.thread);
for (const [t, list] of Object.entries(byThread)) {
  out.push(`- **${t}**: ${list.length} iters, ${list.reduce((a, s) => a + s.new_repos, 0)} repos, ${list.reduce((a, s) => a + s.recs, 0)} recs`);
}

fs.writeFileSync(path.join(__dirname, 'synthesis-digest.md'), out.join('\n') + '\n');
console.log('wrote synthesis-digest.md:', out.join('\n').length, 'chars');
