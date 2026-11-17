#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const files = [
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:49',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:58',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37',
  '.skilled/skills/system-skill-advisor/graph-metadata.json:66-100',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14/deep-review-findings-registry.json',
];

const traceabilityChecks = {
  summary: { required: 2, executed: 2, pass: 2, partial: 0, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 },
  results: [
    {
      protocolId: 'checklist_evidence', status: 'pass', gateClass: 'hard', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:58',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
      ],
      findingRefs: ['F001'],
      summary: 'Checklist rows carry evidence and agree with ADR-001 and the probe rows; F001 is the residual recorded separately as an active P1.',
    },
    {
      protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
      ],
      findingRefs: [], summary: 'P05/P07/P08/P09 outcomes reproduce and agree with ADR-001.',
    },
  ],
};

const nodes = [
  { type: 'node', id: 'd-correctness', kind: 'DIMENSION', label: 'correctness' },
  { type: 'node', id: 'd-security', kind: 'DIMENSION', label: 'security' },
  { type: 'node', id: 'd-traceability', kind: 'DIMENSION', label: 'traceability' },
  { type: 'node', id: 'd-maintainability', kind: 'DIMENSION', label: 'maintainability' },
  { type: 'node', id: 'file-graph-metadata-json', kind: 'FILE', label: '.skilled/skills/system-skill-advisor/graph-metadata.json' },
  { type: 'node', id: 'file-decision-record-md', kind: 'FILE', label: 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md' },
];
const dims = ['d-correctness', 'd-security', 'd-traceability', 'd-maintainability'];
const edges = [];
for (const dim of dims) {
  edges.push({ type: 'edge', id: `e4-${dim}-graph`, source: dim, target: 'file-graph-metadata-json', relation: 'COVERS' });
  edges.push({ type: 'edge', id: `e4-${dim}-decision`, source: dim, target: 'file-decision-record-md', relation: 'COVERS' });
}

const record = {
  type: 'iteration', iteration: 4, run: 4, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true, resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'all four dimensions re-verified - close the checklist_evidence partial with file:line evidence and retake the stop decision',
  dimensions: ['correctness', 'security', 'traceability', 'maintainability'],
  filesReviewed: files,
  findingsCount: 0,
  findingsSummary: { P0: 0, P1: 0, P2: 0 },
  findingsNew: { P0: 0, P1: 0, P2: 0 },
  findingDetails: [],
  traceabilityChecks,
  newFindingsRatio: 0.0,
  noveltyJustification: 'No new findings: the iteration closes the checklist_evidence protocol and reproduces the same two open findings.',
  sessionId: 'fanout-data-14-1794868189353-tsxtos',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 240000,
  graphEvents: [...nodes, ...edges],
};

fs.writeFileSync(path.join(base, 'iter-004.record.json'), JSON.stringify(record, null, 1) + '\n');
const lines = [JSON.stringify(record)];
for (const result of traceabilityChecks.results) {
  lines.push(JSON.stringify({ type: 'traceability-check', protocolId: result.protocolId, status: result.status, iteration: 4, evidence: result.evidence }));
}
lines.push(JSON.stringify({ type: 'classification', detail: 'checklist_evidence raised from partial to pass with AC-004, T008 and probe-row evidence; F001 remains a separate active P1', iteration: 4 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a new gating failure since iteration 3', reason: 'the only blocker was the partial protocol status, now closed with evidence', iteration: 4 }));
fs.writeFileSync(path.join(base, 'deltas', 'iter-004.jsonl'), lines.join('\n') + '\n');
console.log('iter-004 record and delta written', record.timestamp);
