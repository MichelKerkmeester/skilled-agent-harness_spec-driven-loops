// Builds one iteration record from a spec JSON, hands it to the gateway, writes the delta.
const fs = require('fs'); const { execFileSync } = require('child_process');
const L = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/opus-medium-3';
const s = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const n = s.iteration; const NNN = String(n).padStart(3, '0');
const sum = { P0: 0, P1: 0, P2: 0 }; for (const f of s.findings) sum[f.severity]++;
const w = { P0: 10, P1: 5, P2: 1 };
const rec = {
  type: 'iteration', iteration: n, mode: 'review', target_agent: 'deep-review', agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review', run: `run-${NNN}`, status: 'complete',
  focus: s.focus, dimensions: s.dimensions, filesReviewed: s.filesReviewed,
  findingsCount: s.findings.length, findingsSummary: sum, findingsNew: s.findings.map((f) => f.id),
  findingDetails: s.findings.map((f) => ({ id: f.id, severity: f.severity, title: f.title, file: f.file, dimension: s.dimensions[0], findingClass: f.findingClass })),
  traceabilityChecks: { results: s.traceability },
  newFindingsRatio: s.newFindingsRatio, noveltyJustification: s.novelty,
  sessionId: 'fanout-opus-medium-3-1795495423434-9mvwzq', generation: 2, lineageMode: 'new',
  timestamp: new Date().toISOString(), durationMs: s.durationMs,
  graphEvents: s.graphEvents || [],
};
const tmp = `${process.env.TMPDIR || '/tmp'}/dr-o3-iter-${NNN}.json`;
fs.writeFileSync(tmp, JSON.stringify(rec));
const out = execFileSync('node', ['.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs', '--mode', 'review', '--run-directory', L, '--event-json', tmp], { encoding: 'utf8' });
console.log(out.slice(0, 300));
fs.unlinkSync(tmp);
const delta = `${L}/deltas/iter-${NNN}.jsonl`;
if (fs.existsSync(delta)) throw new Error('delta exists');
const lines = [JSON.stringify(rec), ...s.findings.map((f) => JSON.stringify({ type: 'finding', id: f.id, severity: f.severity, title: f.title, file: f.file, dimension: s.dimensions[0], iteration: n, ...(f.refines ? { refines: f.refines } : {}) })),
  ...(s.ruledOut || []).map((r) => JSON.stringify({ type: 'ruled_out', direction: r.direction, reason: r.reason, iteration: n }))];
fs.writeFileSync(delta, lines.join('\n') + '\n');
console.log('delta written', lines.length);
