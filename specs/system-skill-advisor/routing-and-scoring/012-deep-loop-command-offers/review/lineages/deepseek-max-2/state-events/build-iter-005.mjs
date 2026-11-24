import { readFileSync, writeFileSync } from 'node:fs';

const L = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2';
const D = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers';
const ts = readFileSync(`${L}/state-events/iter-005-ts.txt`, 'utf8').trim();

const findings = [
  {
    id: 'R5-P2-001',
    title: 'The reducer renumbers four machine sections, so every template-derived strategy ends with two section 4, 5, 9 and 11 headings',
    file: '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2580',
    findingClass: 'reducer-output-defect',
    affectedSurfaceHints: ['reduce-state.cjs section writers', 'deep-review-strategy.md template numbering', 'every deep-review strategy file the reducer touches'],
    scopeProof: 'the reducer, the template and the produced strategy are all inside the pre-bound scope list; the produced file is this lineage own artifact, so the defect is observed',
  },
];

const record = {
  type: 'iteration',
  iteration: 5,
  run: 5,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'maintainability',
  dimensions: ['maintainability'],
  filesReviewed: [
    '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995',
    '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2362',
    '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2420',
    '.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:406',
    '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363',
    '.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md:61',
    '.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-heading.vitest.ts:37',
    `${D}/implementation-summary.md:238`,
    `${L}/deep-review-strategy.md:25`,
  ],
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 0, P2: 1 },
  findingsNew: { P0: 0, P1: 0, P2: 1 },
  findingDetails: findings.map((f) => ({ ...f, severity: 'P2', dimension: 'maintainability', scopeProof: f.scopeProof })),
  traceabilityChecks: {
    summary: { required: 2, executed: 2, pass: 1, partial: 1, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 },
    results: [
      { protocolId: 'spec_code', status: 'partial', gateClass: 'hard', applicable: true, evidence: ['.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995', '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2362', '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363', `${D}/implementation-summary.md:238`], summary: 'REQ-001 to REQ-046 mapped: REQ-012 and REQ-031 do not hold, every other requirement holds on code, probe or decision, so the protocol stays partial until those two are fixed' },
      { protocolId: 'checklist_evidence', status: 'partial', gateClass: 'hard', applicable: true, evidence: [`${D}/acceptance-criteria.md:96`, `${D}/acceptance-criteria.md:98`, `${D}/acceptance-criteria.md:109`], summary: 'AC-039, AC-041 and AC-054 re-read and hold; the failing cells are those recorded in iterations 1 and 3' },
    ],
  },
  newFindingsRatio: 0.083,
  noveltyJustification: 'One new P2 against a running weighted total of 12 (twelve P2 at weight 1), so 1/12 = 0.083, below the 0.10 threshold as telemetry. The finding is new: it comes from this lineage own reducer output and no earlier iteration opened the strategy section numbering.',
  sessionId: 'fanout-deepseek-max-2-1795544069299-46zw3s',
  generation: 6,
  lineageMode: 'new',
  timestamp: ts,
  durationMs: 300000,
  graphEvents: [
    { type: 'node', id: 'finding:R5-P2-001', kind: 'FINDING', label: findings[0].title },
    { type: 'node', id: 'dimension:maintainability', kind: 'DIMENSION', label: 'maintainability' },
    { type: 'edge', id: 'finding:R5-P2-001->dimension:maintainability', source: 'finding:R5-P2-001', target: 'dimension:maintainability', relation: 'IN_DIMENSION' },
  ],
};

writeFileSync(`${L}/state-events/iter-005-record.json`, `${JSON.stringify(record)}\n`);
const delta = [JSON.stringify(record)];
for (const f of findings) delta.push(JSON.stringify({ type: 'finding', id: f.id, severity: 'P2', title: f.title, file: f.file, cluster: 'reducer-output', iteration: 5 }));
delta.push(JSON.stringify({ type: 'classification', detail: 'Maintainability slice: REQ-032 and REQ-046 hold in code and on this lineage own reducer output; the reducer duplicates four section numbers in every template-derived strategy.', iteration: 5 }));
delta.push(JSON.stringify({ type: 'traceability_check', protocolId: 'spec_code', status: 'partial', iteration: 5, evidence: 'reduce-state.cjs:995,2362; advisor-recommend.ts:363; implementation-summary.md:238' }));
delta.push(JSON.stringify({ type: 'ruled_out', direction: 'A refinement that loses its own entry in the reducer', reason: 'refinesSameLocation splits other-file and other-dimension refinements and the closeout reads the same link', iteration: 5 }));
delta.push(JSON.stringify({ type: 'ruled_out', direction: 'A ruled-out direction written as a permanent prohibition', reason: 'one-attempt rulings carry a reopen line; only repeated evidence blocks', iteration: 5 }));
writeFileSync(`${L}/deltas/iter-005.jsonl`, `${delta.join('\n')}\n`);
console.log('built iteration 5', ts);
