#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const root = '.skilled/skills/system-skill-advisor/graph-metadata.json';
const adr = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md';

const files = [
  '.skilled/skills/system-skill-advisor/graph-metadata.json:1-160',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:1-38',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:49',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:58',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt:1-25',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-14.txt',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-14.txt',
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report.md:18',
  '.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1724-1869',
  '.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1263-1300',
  '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:60-100',
];

const finding = {
  id: 'F001',
  severity: 'P1',
  title: 'Four ordinary prompts still top the advisor through pre-existing generic intent signals',
  dimension: 'correctness',
  file: '.skilled/skills/system-skill-advisor/graph-metadata.json:70',
  evidence: 'route request to the backend service returns system-skill-advisor 0.82 (author:route request), which skill should I learn next as a developer returns it (author:which skill), not offering a skill in the job listing returns it (author:not offering a skill), and measure the workflow throughput returns it; dropping only the matching signal removes the advisor top-1 in each case and measure then returns sk-design.',
  recommendation: 'Narrow the generic signals to advisor-specific compounds, or exclude their single tokens from the lexical lane, and pin the four prompts as ordinary-sense fixtures.',
  disposition: 'active',
  findingClass: 'algorithmic',
  scopeProof: 'Ran the built native scorer in-process with the committed SQLite projection (33 canonical advisor signals, 37 after phrase variants) on the four prompts, then re-scored each with only its matching signal removed; the advisor top-1 disappears in all four and no other lane or graph edge supplies it.',
  affectedSurfaceHints: [
    '.skilled/skills/system-skill-advisor/graph-metadata.json',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts',
    '.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt',
  ],
  type: 'correctness',
  claim: 'Remaining generic intent signals route ordinary prompts to system-skill-advisor, so the pass-thirteen leak class is reduced rather than closed.',
  evidenceRefs: [
    '.skilled/skills/system-skill-advisor/graph-metadata.json:69-70',
    '.skilled/skills/system-skill-advisor/graph-metadata.json:94',
    '.skilled/skills/system-skill-advisor/graph-metadata.json:98',
    'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt:16-20',
  ],
  counterevidenceSought: 'Checked whether the top-1 came from the skill description or a graph edge rather than the signal; re-scored with only the matching signal dropped and the advisor top-1 disappeared in all four. Checked whether the prompts are advisor-domain; they are backend, career, HR and ops prompts. Checked the pass-thirteen record; its five-prompt check does not cover these inputs.',
  alternativeExplanation: 'The graph prerequisite edge sk-code -> system-skill-advisor and the advisor description contribute small amounts, but the single-signal drop test removes the top-1, so each signal is load-bearing.',
  finalSeverity: 'P1',
  confidence: 0.9,
  downgradeTrigger: 'If the operator scopes the advisor to any prompt containing route request or which skill, or a later change narrows those signals and the four prompts stop topping the advisor.',
};

const traceabilityChecks = {
  summary: { required: 2, executed: 4, pass: 2, partial: 1, fail: 0, blocked: 0, notApplicable: 1, gatingFailures: 0 },
  results: [
    {
      protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json',
      ],
      findingRefs: [], summary: 'ADR-001 P05/P07/P08/P09 outcomes match the tree and the probe rows.',
    },
    {
      protocolId: 'checklist_evidence', status: 'partial', gateClass: 'hard', applicable: true,
      counts: { pass: 0, partial: 1, fail: 0 },
      evidence: [
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59',
        'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:58',
      ],
      findingRefs: ['F001'], summary: 'AC-004 agrees with ADR-001; T008 evidence is wider than its five-prompt check.',
    },
    {
      protocolId: 'skill_agent', status: 'pass', gateClass: 'soft', applicable: true,
      counts: { pass: 1, partial: 0, fail: 0 },
      evidence: ['.skilled/skills/system-skill-advisor/graph-metadata.json:66-100'],
      findingRefs: [], summary: 'Author metadata and the committed projection carry the same 33 signals.',
    },
    {
      protocolId: 'agent_cross_runtime', status: 'notApplicable', gateClass: 'soft', applicable: false,
      counts: { pass: 0, partial: 0, fail: 0 },
      evidence: [], findingRefs: [],
      summary: 'No agent file or runtime-specific surface in this area.',
    },
  ],
};

const nodes = [
  { type: 'node', id: 'd-correctness', kind: 'DIMENSION', label: 'correctness' },
  { type: 'node', id: 'd-traceability', kind: 'DIMENSION', label: 'traceability' },
  { type: 'node', id: 'file-graph-metadata-json', kind: 'FILE', label: root },
  { type: 'node', id: 'file-decision-record-md', kind: 'FILE', label: adr },
  { type: 'node', id: 'f-F001', kind: 'FINDING', label: finding.title },
  { type: 'node', id: 'ev-F001', kind: 'EVIDENCE', label: '.skilled/skills/system-skill-advisor/graph-metadata.json:70' },
];
const edges = [
  { type: 'edge', id: 'e-cov-c-graph', source: 'd-correctness', target: 'file-graph-metadata-json', relation: 'COVERS' },
  { type: 'edge', id: 'e-cov-c-decision', source: 'd-correctness', target: 'file-decision-record-md', relation: 'COVERS' },
  { type: 'edge', id: 'e-cov-t-graph', source: 'd-traceability', target: 'file-graph-metadata-json', relation: 'COVERS' },
  { type: 'edge', id: 'e-cov-t-decision', source: 'd-traceability', target: 'file-decision-record-md', relation: 'COVERS' },
  { type: 'edge', id: 'e-dim-F001', source: 'f-F001', target: 'd-correctness', relation: 'IN_DIMENSION' },
  { type: 'edge', id: 'e-file-F001', source: 'f-F001', target: 'file-graph-metadata-json', relation: 'IN_FILE' },
  { type: 'edge', id: 'e-ev-F001', source: 'ev-F001', target: 'f-F001', relation: 'EVIDENCE_FOR' },
];

const record = {
  type: 'iteration', iteration: 1, run: 1, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true, resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'correctness and traceability - ordinary prompts against the remaining intent signals, and ADR-001 against AC-004 and the probe rows',
  dimensions: ['correctness', 'traceability'],
  filesReviewed: files,
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 1, P2: 0 },
  findingsNew: { P0: 0, P1: 1, P2: 0 },
  findingDetails: [finding],
  traceabilityChecks,
  newFindingsRatio: 1.0,
  noveltyJustification: 'First iteration, one new P1: pass thirteen recorded the six removed phrases, and no recorded finding names the residual generic signals that still pull the four ordinary prompts.',
  sessionId: 'fanout-data-14-1794868189353-tsxtos',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 960000,
  graphEvents: [...nodes, ...edges],
};

fs.writeFileSync(path.join(base, 'iter-001.record.json'), JSON.stringify(record, null, 1) + '\n');
const lines = [JSON.stringify(record)];
lines.push(JSON.stringify({ type: 'finding', id: 'F001', severity: 'P1', title: finding.title, file: finding.file, iteration: 1 }));
lines.push(JSON.stringify({ type: 'classification', detail: 'P1 kept after compact skeptic/referee: pre-existing signals, ordinary inputs, single-signal drop test removes the advisor top-1', iteration: 1 }));
for (const result of traceabilityChecks.results) {
  lines.push(JSON.stringify({ type: 'traceability-check', protocolId: result.protocolId, status: result.status, iteration: 1, evidence: result.evidence }));
}
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'stale SQLite projection still carrying the six removed phrases', reason: 'projection lists 33 canonical signals and none of the six', iteration: 1 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'regression in the five prompts pass thirteen tested', reason: 'all five reproduce the pass-thirteen transcript', iteration: 1 }));
fs.writeFileSync(path.join(base, 'deltas', 'iter-001.jsonl'), lines.join('\n') + '\n');
console.log('iter-001 record and delta written', record.timestamp);
