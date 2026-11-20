// Lineage-local helper: builds one iteration record + delta pair.
// Writes only inside the lineage directory it is given.
const fs = require('fs');
const path = require('path');

const L = process.argv[2];
const spec = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

const record = {
  type: 'iteration',
  iteration: spec.iteration,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-vibe-1-1795172940208-84a42n',
  status: spec.status || 'complete',
  focus: spec.focus,
  dimensions: spec.dimensions,
  filesReviewed: spec.filesReviewed,
  findingsCount: spec.findings.length,
  findingsSummary: spec.findingsSummary,
  findingsNew: spec.findings.map((f) => f.id),
  findingDetails: spec.findings.map((f) => ({
    id: f.id,
    severity: f.severity,
    title: f.title,
    file: f.file,
    dimension: spec.dimensions[0],
  })),
  traceabilityChecks: { results: spec.traceabilityChecks },
  newFindingsRatio: spec.newFindingsRatio,
  noveltyJustification: spec.noveltyJustification,
  sessionId: 'fanout-vibe-1-1795172940208-84a42n',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: spec.durationMs || 300000,
};
if (spec.frontierNodeId) record.frontierNodeId = spec.frontierNodeId;
if (spec.graphEvents) record.graphEvents = spec.graphEvents;

const lines = [JSON.stringify(record)];
for (const f of spec.findings) {
  lines.push(JSON.stringify({
    type: 'finding',
    id: f.id,
    severity: f.severity,
    title: f.title,
    file: f.file,
    iteration: spec.iteration,
  }));
}
for (const c of spec.classifications || []) {
  lines.push(JSON.stringify({ type: 'classification', detail: c, iteration: spec.iteration }));
}
for (const t of spec.traceabilityChecks) {
  lines.push(JSON.stringify({
    type: 'traceability-check',
    protocolId: t.protocolId,
    status: t.status,
    iteration: spec.iteration,
    evidence: (t.evidence || []).join(', '),
  }));
}
for (const r of spec.ruledOut || []) {
  lines.push(JSON.stringify({ type: 'ruled_out', direction: r.direction, reason: r.reason, iteration: spec.iteration }));
}
for (const p of spec.frontierProposals || []) {
  lines.push(JSON.stringify({
    type: 'frontier_proposal',
    parentId: p.parentId,
    question: p.question,
    scope: p.scope,
    evidence: p.evidence,
  }));
}

const nnn = String(spec.iteration).padStart(3, '0');
fs.writeFileSync(path.join(L, '.iter-' + nnn + '-record.json'), JSON.stringify(record));
fs.writeFileSync(path.join(L, 'deltas', `iter-${nnn}.jsonl`), lines.join('\n') + '\n');
process.stdout.write(JSON.stringify({ iteration: spec.iteration, deltaLines: lines.length, findings: spec.findings.length }) + '\n');
