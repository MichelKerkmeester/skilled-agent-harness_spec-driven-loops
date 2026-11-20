// Generic iteration builder: reads logs/iter-NNN.json and writes the gateway
// event file plus the delta. Keeps every iteration's record shape identical.
const fs = require('fs');
const path = require('path');
const L = 'specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max';

const nnn = process.argv[2];
if (!nnn) throw new Error('usage: node build-iter.cjs <NNN>');
const payload = JSON.parse(fs.readFileSync(path.join(L, 'logs', `iter-${nnn}.json`), 'utf8'));

const rec = {
  type: 'iteration',
  iteration: payload.iteration,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  status: payload.status || 'complete',
  focus: payload.focus,
  frontierNodeId: payload.frontierNodeId,
  dimensions: payload.dimensions,
  filesReviewed: payload.filesReviewed,
  findingsCount: payload.findingDetails.length,
  findingsSummary: {
    P0: payload.findingDetails.filter((f) => f.severity === 'P0').length,
    P1: payload.findingDetails.filter((f) => f.severity === 'P1').length,
    P2: payload.findingDetails.filter((f) => f.severity === 'P2').length,
  },
  findingsNew: payload.findingDetails.map((f) => f.id),
  findingDetails: payload.findingDetails,
  traceabilityChecks: { results: payload.traceabilityChecks },
  newFindingsRatio: payload.newFindingsRatio,
  noveltyJustification: payload.noveltyJustification,
  sessionId: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: payload.durationMs || 180000,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: payload.reviewDepthApplicability,
  targetSelection: payload.targetSelection,
  searchCoverage: payload.searchCoverage,
  searchLedger: payload.searchLedger,
  graphEvents: payload.graphEvents,
};

fs.writeFileSync(`/tmp/iter-${nnn}-event.json`, JSON.stringify(rec));

const lines = [JSON.stringify(rec)];
for (const f of payload.findingDetails) {
  lines.push(JSON.stringify({ type: 'finding', id: f.id, severity: f.severity, title: f.title, file: f.file, iteration: payload.iteration }));
}
lines.push(JSON.stringify({ type: 'classification', detail: payload.classification, iteration: payload.iteration }));
for (const t of payload.traceabilityChecks) {
  lines.push(JSON.stringify({ type: 'traceability_check', protocolId: t.protocolId, status: t.status, iteration: payload.iteration }));
}
for (const r of payload.ruledOut || []) {
  lines.push(JSON.stringify({ type: 'ruled_out', direction: r.direction, reason: r.reason, iteration: payload.iteration }));
}
for (const p of payload.frontierProposals || []) {
  lines.push(JSON.stringify({ type: 'frontier_proposal', parentId: p.parentId, question: p.question, scope: p.scope, evidence: p.evidence, ...(p.budget ? { budget: p.budget } : {}) }));
}
fs.writeFileSync(path.join(L, 'deltas', `iter-${nnn}.jsonl`), lines.join('\n') + '\n');
console.log(`iter ${payload.iteration}: findings=${payload.findingDetails.length} deltaLines=${lines.length} ts=${rec.timestamp}`);
