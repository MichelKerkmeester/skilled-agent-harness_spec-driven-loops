#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const files = [
  '.skilled/skills/system-skill-advisor/graph-metadata.json:66-100',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14/deep-review-findings-registry.json',
];

const traceabilityChecks = {
  summary: { required: 2, executed: 2, pass: 2, partial: 0, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 },
  results: [
    {
      protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
      ],
      findingRefs: [], summary: 'P05/P07/P08/P09 outcomes still reproduce and agree with ADR-001.',
    },
    {
      protocolId: 'checklist_evidence', status: 'pass', gateClass: 'hard', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:58',
      ],
      findingRefs: ['F001', 'F002'],
      summary: 'Checklist rows carry evidence; F001 and F002 are the separately recorded residuals.',
    },
  ],
};

const nodes = [
  { type: 'node', id: 'd-correctness', kind: 'DIMENSION', label: 'correctness' },
  { type: 'node', id: 'd-maintainability', kind: 'DIMENSION', label: 'maintainability' },
  { type: 'node', id: 'file-graph-metadata-json', kind: 'FILE', label: '.skilled/skills/system-skill-advisor/graph-metadata.json' },
  { type: 'node', id: 'file-decision-record-md', kind: 'FILE', label: 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md' },
];
const edges = [
  { type: 'edge', id: 'e5-c-graph', source: 'd-correctness', target: 'file-graph-metadata-json', relation: 'COVERS' },
  { type: 'edge', id: 'e5-c-decision', source: 'd-correctness', target: 'file-decision-record-md', relation: 'COVERS' },
  { type: 'edge', id: 'e5-m-graph', source: 'd-maintainability', target: 'file-graph-metadata-json', relation: 'COVERS' },
  { type: 'edge', id: 'e5-m-decision', source: 'd-maintainability', target: 'file-decision-record-md', relation: 'COVERS' },
];

const record = {
  type: 'iteration', iteration: 5, run: 5, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true, resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'recovery pass - per-signal ordinary-sense sweep across the remaining 33 intent signals',
  dimensions: ['correctness', 'maintainability'],
  filesReviewed: files,
  findingsCount: 0,
  findingsSummary: { P0: 0, P1: 0, P2: 0 },
  findingsNew: { P0: 0, P1: 0, P2: 0 },
  findingDetails: [],
  traceabilityChecks,
  newFindingsRatio: 0.0,
  noveltyJustification: 'The recovery sweep widened the prompt set but found no out-of-contract case beyond F001 and no doc gap beyond F002; in-domain prompts are not a new finding.',
  sessionId: 'fanout-data-14-1794868189353-tsxtos',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 360000,
  graphEvents: [...nodes, ...edges],
};

fs.writeFileSync(path.join(base, 'iter-005.record.json'), JSON.stringify(record, null, 1) + '\n');
const lines = [JSON.stringify(record)];
for (const result of traceabilityChecks.results) {
  lines.push(JSON.stringify({ type: 'traceability-check', protocolId: result.protocolId, status: result.status, iteration: 5, evidence: result.evidence }));
}
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a broader leak than F001 among the remaining signals', reason: 'the wider sweep produced only in-domain or ambiguous results beyond the four established cases', iteration: 5 }));
lines.push(JSON.stringify({ type: 'classification', detail: 'recovery pass changed granularity to one ordinary-sense prompt per generic signal; no new finding', iteration: 5 }));
fs.writeFileSync(path.join(base, 'deltas', 'iter-005.jsonl'), lines.join('\n') + '\n');
console.log('iter-005 record and delta written', record.timestamp);
