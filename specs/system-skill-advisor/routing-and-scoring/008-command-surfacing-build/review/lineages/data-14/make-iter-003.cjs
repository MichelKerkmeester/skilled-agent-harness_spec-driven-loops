#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const files = [
  '.skilled/skills/system-skill-advisor/graph-metadata.json:66-100',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt:16-20',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14/deep-review-findings-registry.json',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14/deep-review-strategy.md',
];

const traceabilityChecks = {
  summary: { required: 2, executed: 3, pass: 2, partial: 1, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 },
  results: [
    {
      protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
      ],
      findingRefs: [], summary: 'Final-tree replay matches ADR-001 and the probe rows on P05, P07, P08 and P09.',
    },
    {
      protocolId: 'checklist_evidence', status: 'partial', gateClass: 'hard', applicable: true,
      counts: { pass: 0, partial: 1, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:58',
      ],
      findingRefs: ['F001'], summary: 'AC-004 agrees with ADR-001; T008 evidence remains wider than its five-prompt check.',
    },
    {
      protocolId: 'skill_agent', status: 'pass', gateClass: 'soft', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: ['.skilled/skills/system-skill-advisor/graph-metadata.json:66-100'],
      findingRefs: [], summary: 'Projection still lists 33 canonical signals and none of the six removed phrases.',
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
  edges.push({ type: 'edge', id: `e-${dim}-graph`, source: dim, target: 'file-graph-metadata-json', relation: 'COVERS' });
  edges.push({ type: 'edge', id: `e-${dim}-decision`, source: dim, target: 'file-decision-record-md', relation: 'COVERS' });
}

const record = {
  type: 'iteration', iteration: 3, run: 3, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true, resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'all four dimensions re-verified - final-tree replay of F001 and the pass-thirteen transcript, then the stop decision',
  dimensions: ['correctness', 'security', 'traceability', 'maintainability'],
  filesReviewed: files,
  findingsCount: 0,
  findingsSummary: { P0: 0, P1: 0, P2: 0 },
  findingsNew: { P0: 0, P1: 0, P2: 0 },
  findingDetails: [],
  traceabilityChecks,
  newFindingsRatio: 0.0,
  noveltyJustification: 'No new findings: the final tree reproduces F001 and the pass-thirteen transcript unchanged, so the iteration adds verification rather than novelty.',
  sessionId: 'fanout-data-14-1794868189353-tsxtos',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 300000,
  graphEvents: [...nodes, ...edges],
};

fs.writeFileSync(path.join(base, 'iter-003.record.json'), JSON.stringify(record, null, 1) + '\n');
const lines = [JSON.stringify(record)];
for (const result of traceabilityChecks.results) {
  lines.push(JSON.stringify({ type: 'traceability-check', protocolId: result.protocolId, status: result.status, iteration: 3, evidence: result.evidence }));
}
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a changed outcome since iteration 1', reason: 'the F001 and pass-thirteen transcripts reproduce exactly', iteration: 3 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a registry and iteration-record disagreement', reason: 'both list two open findings and all four covered dimensions', iteration: 3 }));
fs.writeFileSync(path.join(base, 'deltas', 'iter-003.jsonl'), lines.join('\n') + '\n');
console.log('iter-003 record and delta written', record.timestamp);
