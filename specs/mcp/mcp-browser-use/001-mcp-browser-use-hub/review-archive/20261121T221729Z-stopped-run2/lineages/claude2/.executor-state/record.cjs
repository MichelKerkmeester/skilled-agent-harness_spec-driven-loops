'use strict';
// Builds the canonical iteration record and the write-once delta from a spec file,
// then hands the record to the append gateway and runs the reducer.
const fs = require('fs');
const { execFileSync } = require('child_process');
const L = 'specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/claude2';
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const n = spec.iteration;
const pad = String(n).padStart(3, '0');
const deltaPath = `${L}/deltas/iter-${pad}.jsonl`;
if (fs.existsSync(deltaPath)) throw new Error(`delta exists: ${deltaPath}`);
const summary = { P0: 0, P1: 0, P2: 0 };
for (const f of spec.findings) summary[f.severity] += 1;
const record = {
  type: 'iteration', iteration: n, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: n, status: 'complete', focus: spec.focus, dimensions: spec.dimensions,
  filesReviewed: spec.filesReviewed, findingsCount: spec.findings.length,
  findingsSummary: summary,
  findingsNew: spec.findings.filter((f) => !f.refines).map((f) => f.id),
  findingDetails: spec.findings.map((f) => ({
    id: f.id, severity: f.severity, title: f.title, file: f.file, dimension: f.dimension,
    findingClass: f.findingClass, scopeProof: f.scopeProof, affectedSurfaceHints: f.affectedSurfaceHints,
    ...(f.adjudication ? f.adjudication : {}),
    ...(f.refines ? { refines: f.refines } : {}),
  })),
  traceabilityChecks: { results: spec.traceability },
  newFindingsRatio: spec.newFindingsRatio, noveltyJustification: spec.noveltyJustification,
  ruledOut: spec.ruledOut || [],
  sessionId: 'fanout-claude2-1795298930568-k8qdqy', generation: 1, lineageMode: 'new',
  timestamp: new Date().toISOString(), durationMs: spec.durationMs || 600000,
  graphEvents: spec.graphEvents || [],
};
const recFile = `${L}/.executor-state/iter-${pad}.record.json`;
fs.writeFileSync(recFile, JSON.stringify(record));
const lines = [JSON.stringify(record)];
for (const f of spec.findings) {
  lines.push(JSON.stringify({ type: 'finding', id: f.id, severity: f.severity, title: f.title, file: f.file, dimension: f.dimension, iteration: n, ...(f.refines ? { refines: f.refines } : {}) }));
}
for (const t of spec.traceability) lines.push(JSON.stringify({ type: 'traceability_check', protocolId: t.protocolId, status: t.status, iteration: n }));
for (const r of spec.ruledOut || []) lines.push(JSON.stringify({ type: 'ruled_out', direction: r.direction, reason: r.reason, iteration: n }));
fs.mkdirSync(`${L}/deltas`, { recursive: true });
fs.writeFileSync(deltaPath, lines.join('\n') + '\n', { flag: 'wx' });
const gw = execFileSync('node', ['.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs', '--mode', 'review', '--run-directory', L, '--event-json', recFile], { encoding: 'utf8' });
console.log('gateway:', gw.slice(0, 300));
const red = execFileSync('node', ['.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs', 'specs/mcp/mcp-browser-use/001-mcp-browser-use-hub', '--artifact-dir', L, '--create-missing-anchors'], { encoding: 'utf8' });
console.log('reducer:', red.slice(0, 600));
