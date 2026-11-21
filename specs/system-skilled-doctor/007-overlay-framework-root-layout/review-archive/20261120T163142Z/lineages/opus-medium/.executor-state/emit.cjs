// Lineage-local helper: record one iteration through the gateway, write its delta,
// then run admit, reduce, graph upsert and convergence as the workflow YAML does.
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const L = 'specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/opus-medium';
const SPEC = 'specs/system-skilled-doctor/007-overlay-framework-root-layout';
const S = 'fanout-opus-medium-1795182837437-sws2tv';
const RT = '.skilled/skills/system-deep-loop/runtime/scripts';
const n = Number(process.argv[2]);
const NNN = String(n).padStart(3, '0');
const spec = JSON.parse(fs.readFileSync(path.join(L, '.executor-state', `iter-${NNN}.json`), 'utf8'));
const env = { ...process.env, DEEP_LOOP_COVERAGE_DB_DIR: path.resolve(L, 'graph-db') };
const run = (label, args) => {
  const r = spawnSync('node', args, { encoding: 'utf8', env });
  console.log(`== ${label} exit=${r.status}`);
  const out = (r.stdout || '') + (r.stderr || '');
  console.log(out.length > 1500 ? out.slice(0, 1500) + ' …' : out);
  return r;
};

const findings = spec.findings || [];
const summary = { P0: 0, P1: 0, P2: 0 };
for (const f of findings) summary[f.severity] += 1;
const record = {
  type: 'iteration', iteration: n, mode: 'review', target_agent: 'deep-review', agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review', run: S, status: 'complete',
  ...spec.record,
  findingsCount: findings.length, findingsSummary: summary,
  findingsNew: findings.map((f) => f.id),
  findingDetails: findings.map((f) => ({ id: f.id, severity: f.severity, title: f.title, file: f.file, dimension: f.dimension, ...(f.refines ? { refines: f.refines } : {}), ...(f.adjudication || {}) })),
  sessionId: S, generation: 1, lineageMode: 'new', timestamp: new Date().toISOString(),
};
const strategyPath = path.join(L, 'deep-review-strategy.md');
let strategy = fs.readFileSync(strategyPath, 'utf8');
const insertAfter = (heading, lines) => {
  if (!lines || lines.length === 0) return;
  const at = strategy.indexOf(heading);
  if (at < 0) return;
  const end = at + heading.length;
  strategy = strategy.slice(0, end) + '\n' + lines.map((line) => `- ${line} (iteration ${n})`).join('\n') + strategy.slice(end);
};
insertAfter('## 8. WHAT WORKED', spec.worked);
insertAfter('## 9. WHAT FAILED', spec.failed);
insertAfter('## 11. RULED OUT DIRECTIONS', spec.ruledOut);
fs.writeFileSync(strategyPath, strategy);
const recordFile = path.join(L, '.executor-state', `record-${NNN}.json`);
fs.writeFileSync(recordFile, JSON.stringify(record) + '\n');
const gw = run('gateway', [`${RT}/append-mode-event.cjs`, '--mode', 'review', '--run-directory', L, '--event-json', recordFile]);
if (gw.status !== 0) process.exit(2);

const deltaPath = path.join(L, 'deltas', `iter-${NNN}.jsonl`);
if (fs.existsSync(deltaPath)) { console.log('delta exists, refusing to overwrite'); process.exit(2); }
const rows = [JSON.stringify(record)];
for (const f of findings) rows.push(JSON.stringify({ type: 'finding', id: f.id, severity: f.severity, title: f.title, file: f.file, dimension: f.dimension, iteration: n, ...(f.refines ? { refines: f.refines } : {}) }));
for (const extra of spec.extra || []) rows.push(JSON.stringify({ iteration: n, ...extra }));
fs.writeFileSync(deltaPath, rows.join('\n') + '\n');

const reg = JSON.parse(fs.readFileSync(path.join(L, 'deep-review-findings-registry.json'), 'utf8'));
const known = ((reg.frontier && reg.frontier.nodes) || []).map((node) => node.question);
fs.writeFileSync(path.join(L, 'frontier-known-texts.json'), JSON.stringify(known) + '\n');
run('admit', [`${RT}/frontier-admit.cjs`, 'admit', '--target', 'review', '--artifact-dir', L, '--iteration', String(n), '--input', deltaPath, '--known-texts', path.join(L, 'frontier-known-texts.json')]);
run('reduce', [`${RT}/reduce-state.cjs`, SPEC, '--artifact-dir', L, '--create-missing-anchors']);
const dims = ['correctness', 'security', 'traceability', 'maintainability'];
const files = [...new Set((record.filesReviewed || []).map((ref) => ref.replace(/:\d+$/, '')))];
const graphNodes = [
  ...dims.map((d) => ({ id: `dimension:${d}`, kind: 'DIMENSION', name: d, iteration: n })),
  ...files.map((f) => ({ id: `file:${f}`, kind: 'FILE', name: f, iteration: n })),
];
const graphEdges = (record.dimensions || []).flatMap((d) => files.map((f) => ({ id: `covers:${d}:${f}`, relation: 'COVERS', sourceId: `dimension:${d}`, targetId: `file:${f}` })));
run('upsert', [`${RT}/upsert.cjs`, '--spec-folder', SPEC, '--loop-type', 'review', '--session-id', S, '--nodes', JSON.stringify(graphNodes), '--edges', JSON.stringify(graphEdges), '--state-log', path.join(L, 'deep-review-state.jsonl'), '--delta-dir', path.join(L, 'deltas'), '--iteration', String(n)]);
const conv = spawnSync('node', [`${RT}/convergence.cjs`, '--spec-folder', SPEC, '--loop-type', 'review', '--session-id', S, '--convergence-mode', 'default', '--depth-mode', 'expansive', '--stop-decision', '--config-path', path.join(L, 'deep-review-config.json'), '--state-log', path.join(L, 'deep-review-state.jsonl'), '--registry-path', path.join(L, 'deep-review-findings-registry.json'), '--iteration-count', String(n), '--security-sensitive-fix-scope', 'false', '--fix-replay-required-rows', '0', '--fix-replay-passing-rows', '0'], { encoding: 'utf8', env });
console.log(`== convergence exit=${conv.status}`);
try {
  const out = JSON.parse(conv.stdout);
  const sd = out.stop_decision || (out.data && out.data.stop_decision) || {};
  console.log(JSON.stringify({ decision: sd.decision, stopReason: sd.stopReason, reasonDetail: sd.reasonDetail, blockedBy: sd.blockedBy, counters: out.loop_counters_json || (out.data && out.data.loop_counters_json) }));
} catch (error) {
  console.log((conv.stdout || '').slice(0, 1200), (conv.stderr || '').slice(0, 600));
}
const after = JSON.parse(fs.readFileSync(path.join(L, 'deep-review-findings-registry.json'), 'utf8'));
const fr = after.frontier || {};
console.log('frontier active:', fr.activeNodeId, fr.activeNextDimension);
console.log('nodes:', (fr.nodes || []).map((node) => `${node.nodeId}:${node.status}:[${(node.coveredDimensions || []).join(',')}]`).join(' '));
console.log('findingsBySeverity:', JSON.stringify(after.findingsBySeverity), 'open:', after.openFindingsCount);
