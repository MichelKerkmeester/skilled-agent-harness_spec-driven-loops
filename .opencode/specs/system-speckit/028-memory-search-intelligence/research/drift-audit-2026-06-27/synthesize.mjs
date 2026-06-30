// Converge the 028 drift-audit findings: dedup by file+type (merging cross-model
// corroboration), group by severity / surface area / model, write converged-report.md.
import fs from 'node:fs';
import path from 'node:path';

const ART = path.dirname(new URL(import.meta.url).pathname);
const raw = fs.readFileSync(path.join(ART, 'findings.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

const sevRank = { P0: 0, P1: 1, P2: 2 };
const fileOf = (loc) => String(loc || '').split(':')[0];
const lineOf = (loc) => String(loc || '').split(':').slice(1).join(':');

function area(loc) {
  const f = fileOf(loc);
  let m;
  if ((m = f.match(/\.opencode\/commands\/([^/]+)\//))) return `commands/${m[1]}`;
  if ((m = f.match(/\.opencode\/skills\/([^/]+)\//))) return `skills/${m[1]}`;
  if (/(\.claude|\.opencode|\.codex)\/agents\//.test(f)) return 'agents';
  if (/\.opencode\/specs\/system-spec-kit\/028/.test(f)) return '028 spec tree';
  if (/^\.github\//.test(f)) return '.github';
  const parts = f.split('/').filter(Boolean);
  return parts.slice(0, 2).join('/') || f;
}

// Cluster by file+type (merge corroboration); keep highest severity, collect models/lines/evidence.
const clusters = new Map();
for (const r of raw) {
  const key = `${fileOf(r.location)}::${r.type}`;
  if (!clusters.has(key)) clusters.set(key, { file: fileOf(r.location), type: r.type, sev: r.severity, title: r.title, evidence: r.evidence, fix: r.fix, lines: new Set(), models: new Set(), iters: new Set(), n: 0 });
  const c = clusters.get(key);
  c.n += 1;
  if (lineOf(r.location)) c.lines.add(lineOf(r.location));
  if (r.model) c.models.add(r.model);
  if (r.iter != null) c.iters.add(r.iter);
  if ((sevRank[r.severity] ?? 9) < (sevRank[c.sev] ?? 9)) { c.sev = r.severity; c.title = r.title; c.evidence = r.evidence; c.fix = r.fix; }
}
const merged = [...clusters.values()].sort((a, b) => (sevRank[a.sev] - sevRank[b.sev]) || (b.n - a.n));

// Tallies
const tally = (arr, keyFn) => arr.reduce((m, x) => { const k = keyFn(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const rawBySev = tally(raw, (r) => r.severity);
const mergedBySev = tally(merged, (c) => c.sev);
const byArea = {};
for (const c of merged) { const a = area(c.file + (c.lines.size ? ':' + [...c.lines][0] : '')); (byArea[a] = byArea[a] || { P0: 0, P1: 0, P2: 0, total: 0 }); byArea[a][c.sev]++; byArea[a].total++; }
const byModelRaw = tally(raw, (r) => r.model);
const corroborated = merged.filter((c) => c.models.size > 1);

// Build report
const L = [];
L.push('# 028 Drift Audit — Converged Report');
L.push('');
L.push('Direct-orchestration deep research, **50 iterations**, read-only executors (harness owned all writes).');
L.push('Executors: kimi `k2p7` + gpt-5.5-fast (iters 1-30 also used mimo + deepseek before the mid-run switch to kimi/gpt-5.5-high only).');
L.push('');
L.push('## Totals');
L.push(`- Raw findings: **${raw.length}** across 50 iterations`);
L.push(`- Converged (deduped by file+type): **${merged.length}** distinct issues`);
L.push(`- Cross-model corroborated (same file+type from >=2 models): **${corroborated.length}**`);
L.push(`- Raw severity: P0 ${rawBySev.P0 || 0} / P1 ${rawBySev.P1 || 0} / P2 ${rawBySev.P2 || 0}`);
L.push(`- Converged severity: **P0 ${mergedBySev.P0 || 0} / P1 ${mergedBySev.P1 || 0} / P2 ${mergedBySev.P2 || 0}**`);
L.push('');
L.push('> Every finding is a HYPOTHESIS produced by an LLM executor with file:line evidence. Confirm against the real file before acting — especially before any fix.');
L.push('');

L.push('## P0 — converged');
for (const c of merged.filter((x) => x.sev === 'P0')) {
  L.push(`### \`${c.file}\`${c.lines.size ? ' (' + [...c.lines].slice(0, 3).join(', ') + ')' : ''} — ${c.type}`);
  L.push(`- **${c.title || ''}**`);
  L.push(`- evidence: ${c.evidence || ''}`);
  L.push(`- fix: ${c.fix || ''}`);
  L.push(`- found by: ${[...c.models].join(', ')} (iters ${[...c.iters].join(', ')})${c.models.size > 1 ? ' — CORROBORATED' : ''}`);
  L.push('');
}

L.push('## P1 — converged, grouped by surface area');
const p1byArea = {};
for (const c of merged.filter((x) => x.sev === 'P1')) { const a = area(c.file); (p1byArea[a] = p1byArea[a] || []).push(c); }
for (const a of Object.keys(p1byArea).sort((x, y) => p1byArea[y].length - p1byArea[x].length)) {
  L.push(`### ${a} (${p1byArea[a].length})`);
  for (const c of p1byArea[a]) L.push(`- \`${c.file}\`${c.lines.size ? ':' + [...c.lines][0] : ''} **${c.type}** — ${c.title || ''}${c.models.size > 1 ? ' _(x' + c.models.size + ' models)_' : ''}`);
  L.push('');
}

L.push('## P2 — converged counts by surface area');
const p2byArea = {};
for (const c of merged.filter((x) => x.sev === 'P2')) { const a = area(c.file); p2byArea[a] = (p2byArea[a] || 0) + 1; }
for (const a of Object.keys(p2byArea).sort((x, y) => p2byArea[y] - p2byArea[x])) L.push(`- ${a}: ${p2byArea[a]}`);
L.push('');

L.push('## Hot surface areas (all severities, converged)');
for (const a of Object.keys(byArea).sort((x, y) => byArea[y].total - byArea[x].total).slice(0, 15)) {
  const v = byArea[a]; L.push(`- **${a}** — ${v.total} (P0 ${v.P0} / P1 ${v.P1} / P2 ${v.P2})`);
}
L.push('');

L.push('## Model contribution (raw findings)');
for (const m of Object.keys(byModelRaw).sort((x, y) => byModelRaw[y] - byModelRaw[x])) L.push(`- ${m}: ${byModelRaw[m]}`);
L.push('');

L.push('## Caveats');
L.push('- Findings are unverified LLM hypotheses; treat each as a lead with evidence, not a confirmed defect.');
L.push('- 3 iterations failed (2 parse failures, 1 timeout) — mimo over-explored; those angles are uncovered.');
L.push('- Dedup is by file+type, so two genuinely distinct issues in the same file under the same type may be merged into one cluster; the raw findings.jsonl preserves every individual finding.');
L.push('- Run was capped at 50 of a planned 80 ("converge at 50"); the remaining angle backlog is preserved in angles.json.');
L.push('');

fs.writeFileSync(path.join(ART, 'converged-report.md'), L.join('\n') + '\n');

// machine summary for the operator
console.log(JSON.stringify({
  raw: raw.length, converged: merged.length, corroborated: corroborated.length,
  rawSev: rawBySev, mergedSev: mergedBySev,
  topAreas: Object.entries(byArea).sort((a, b) => b[1].total - a[1].total).slice(0, 8).map(([a, v]) => `${a}:${v.total}(P0:${v.P0},P1:${v.P1})`),
  byModel: byModelRaw,
  p0count: (mergedBySev.P0 || 0),
}, null, 2));
