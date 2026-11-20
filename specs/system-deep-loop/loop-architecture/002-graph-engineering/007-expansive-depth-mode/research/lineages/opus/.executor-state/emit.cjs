// Lineage-local helper: builds one iteration record and its delta from a spec JSON,
// records the record through the append gateway, then writes the delta once.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const [specPath, L] = process.argv.slice(2);
const s = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const SID = 'fanout-opus-1795179440509-6d2wms';
const n = s.iteration;
const NNN = String(n).padStart(3, '0');
const rec = {
  type: 'iteration', iteration: n, runId: SID, sessionId: SID, lineageId: SID,
  mode: 'research', target_agent: 'deep-research', agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: n, status: s.status, focus: s.focus, findingsCount: s.findings.length,
  newInfoRatio: s.newInfoRatio, noveltyJustification: s.noveltyJustification,
  keyQuestions: s.keyQuestions, answeredQuestions: s.answeredQuestions,
  ruledOut: s.ruledOut, focusTrack: s.focusTrack, edgeCase: s.edgeCase || 'none',
  toolsUsed: s.toolsUsed, sourcesQueried: s.sourcesQueried, graphEvents: s.graphEvents || [],
};
const deltaPath = path.join(L, 'deltas', `iter-${NNN}.jsonl`);
if (fs.existsSync(deltaPath)) throw new Error('delta exists');
if (!fs.existsSync(path.join(L, 'iterations', `iteration-${NNN}.md`))) throw new Error('iteration file missing');
const ev = path.join(L, '.executor-state', `event-${NNN}.json`);
fs.writeFileSync(ev, JSON.stringify(rec));
const out = execFileSync('node', [
  '.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs',
  '--mode', 'research', '--run-directory', L, '--event-json', ev,
], { encoding: 'utf8' });
const j = JSON.parse(out);
if (!j.ok) throw new Error(out);
const rows = [
  rec,
  ...s.findings.map((f, i) => ({
    type: 'finding', id: `f-opus-iter${NNN}-${String(i + 1).padStart(3, '0')}`,
    label: f.label, iteration: n, sources: f.sources,
  })),
  ...(s.proposals || []),
  ...(s.ruledOutRows || []).map((r) => ({ type: 'ruled_out', ...r, iteration: n })),
];
fs.writeFileSync(deltaPath, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
console.log(JSON.stringify({ receipt: j.receipt.sequence, committedAt: j.receipt.committed_at, delta: deltaPath, findings: s.findings.length }));
