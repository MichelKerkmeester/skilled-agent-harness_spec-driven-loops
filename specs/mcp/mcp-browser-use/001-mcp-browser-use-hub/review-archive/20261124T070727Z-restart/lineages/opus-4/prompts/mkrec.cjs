// Builds the canonical iteration record and its delta from a spec JSON file.
const fs = require('fs');
const [specPath, recOut, deltaOut] = process.argv.slice(2);
const s = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const f = s.findings || [];
const sum = { P0: 0, P1: 0, P2: 0 };
f.forEach((x) => { sum[x.severity] += 1; });
const rec = Object.assign({
  type: 'iteration', iteration: s.iteration, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true, resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-opus-4-1795495435655-lf6jf3', status: 'complete', focus: s.focus, dimensions: s.dimensions,
  filesReviewed: s.filesReviewed, findingsCount: f.length, findingsSummary: sum,
  findingsNew: f.map((x) => x.id),
  findingDetails: f.map((x) => ({ id: x.id, severity: x.severity, title: x.title, dimension: x.dimension, file: x.file, findingClass: x.findingClass, scopeProof: x.scopeProof, affectedSurfaceHints: x.affectedSurfaceHints, ...(x.adjudication ? { claimAdjudication: x.adjudication } : {}) })),
  traceabilityChecks: { results: s.traceability }, newFindingsRatio: s.newFindingsRatio,
  noveltyJustification: s.noveltyJustification, sessionId: 'fanout-opus-4-1795495435655-lf6jf3',
  generation: 1, lineageMode: 'new', timestamp: new Date().toISOString(), durationMs: s.durationMs,
}, s.extra || {});
fs.writeFileSync(recOut, JSON.stringify(rec) + '\n');
const lines = [JSON.stringify(rec)];
f.forEach((x) => lines.push(JSON.stringify({ type: 'finding', id: x.id, severity: x.severity, title: x.title, file: x.file, dimension: x.dimension, iteration: s.iteration })));
(s.traceability || []).forEach((t) => lines.push(JSON.stringify({ type: 'traceability_check', protocolId: t.protocolId, status: t.status, iteration: s.iteration })));
(s.ruledOut || []).forEach((r) => lines.push(JSON.stringify({ type: 'ruled_out', direction: r.direction, reason: r.reason, iteration: s.iteration })));
if (fs.existsSync(deltaOut)) { console.error('delta exists'); process.exit(1); }
fs.writeFileSync(deltaOut, lines.join('\n') + '\n');
console.log('built', rec.findingsCount, JSON.stringify(sum));
