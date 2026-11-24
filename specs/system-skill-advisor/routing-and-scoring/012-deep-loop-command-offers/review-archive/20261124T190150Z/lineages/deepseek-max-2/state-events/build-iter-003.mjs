import { readFileSync, writeFileSync } from 'node:fs';

const L = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2';
const D = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers';
const ts = readFileSync(`${L}/state-events/iter-003-ts.txt`, 'utf8').trim();

const findings = [
  { id: 'R3-P2-001', title: 'Five acceptance cells quote the Python fixture count as 285 while the tree holds 347 cases', file: `${D}/acceptance-criteria.md:66`, findingClass: 'stale-measurement', affectedSurfaceHints: ['AC-009', 'AC-028', 'AC-030', 'AC-037', 'AC-042', 'deep-loop-offer-cases.json', 'test_skill_advisor.py'], scopeProof: 'every cell is inside the declared acceptance table; fixture count, printing line and changelog row each read' },
  { id: 'R3-P2-002', title: 'AC-029 and AC-028 quote suite counts the cited changelog row does not carry', file: `${D}/acceptance-criteria.md:86`, findingClass: 'stale-measurement', affectedSurfaceHints: ['AC-028', 'AC-029', 'AC-048', 'v4.2.0.0.md suite row'], scopeProof: 'both cells and the cited changelog line are inside the declared target; the line was printed in full' },
  { id: 'R3-P2-003', title: 'AC-031 counts 26 doctorWithheld fixture rows; the fixture carries 47', file: `${D}/acceptance-criteria.md:88`, findingClass: 'stale-measurement', affectedSurfaceHints: ['AC-031', 'deep-loop-offer-cases.json doctor columns'], scopeProof: 'the cell and the fixture are inside the declared target; the count was produced from the fixture itself' },
  { id: 'R3-P2-004', title: 'AC-032 says four multi-typed rows pin both loops in both orders; two of the four pin one loop against a non-loop command', file: `${D}/acceptance-criteria.md:89`, findingClass: 'overstated-evidence', affectedSurfaceHints: ['AC-032', 'deep-loop-offer-cases.json typed rows', 'multi-typed-command-gates.vitest.ts'], scopeProof: "the cell and the four fixture rows are inside the declared target; each row's typedRunsKept value was read" },
  { id: 'R3-P2-005', title: "AC-033's mode-cue anchor lands inside commandOnlyMentioned, not on the loop that skips a subject-read mode name", file: `${D}/acceptance-criteria.md:90`, findingClass: 'evidence-anchor-drift', affectedSurfaceHints: ['AC-033', 'command-attach.ts loopAskCues', 'command-attach-guards.vitest.ts deferred-cue group'], scopeProof: 'the cell and both line ranges are inside the declared target; both were printed' },
  { id: 'R3-P2-006', title: "AC-034's Python anchor is a blank line; the stage-one copy it names is 250 lines further down", file: `${D}/acceptance-criteria.md:91`, findingClass: 'evidence-anchor-drift', affectedSurfaceHints: ['AC-034', 'skill_advisor.py _is_loop_workflow_request', 'stage-one-loop-subject.vitest.ts'], scopeProof: 'the cell, the blank line and the definition are inside the declared target; both lines were printed' },
  { id: 'R3-P2-007', title: 'Three cells in the sixth-round range pin fixture rows eight to thirteen lines away from where they now sit', file: `${D}/acceptance-criteria.md:101`, findingClass: 'evidence-anchor-drift', affectedSurfaceHints: ['AC-044', 'AC-045', 'AC-046', 'deep-loop-offer-cases.json plural, question and effort blocks'], scopeProof: 'the three cells and every cited and actual line are inside the declared target; each was printed' },
];

const record = {
  type: 'iteration',
  iteration: 3,
  run: 3,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'traceability',
  dimensions: ['traceability'],
  filesReviewed: [
    `${D}/acceptance-criteria.md:49`,
    `${D}/tasks.md:226`,
    `${D}/decision-record.md:33`,
    '.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120',
    '.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854',
    '.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1475',
    '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5820',
    '.skilled/changelog/skilled/v4.2.0.0.md:759',
  ],
  findingsCount: 7,
  findingsSummary: { P0: 0, P1: 0, P2: 7 },
  findingsNew: { P0: 0, P1: 0, P2: 7 },
  findingDetails: findings.map((f) => ({ ...f, severity: 'P2', dimension: 'traceability' })),
  traceabilityChecks: {
    summary: { required: 2, executed: 1, pass: 0, partial: 2, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 },
    results: [
      { protocolId: 'checklist_evidence', status: 'partial', gateClass: 'hard', applicable: true, evidence: [`${D}/acceptance-criteria.md:66`, `${D}/acceptance-criteria.md:101`, `${D}/tasks.md:322`], summary: 'AC-001..AC-054 opened; seven cells fail their own evidence; the Verification Summary agrees with its boxes and T084 is the one open task' },
      { protocolId: 'spec_code', status: 'partial', gateClass: 'hard', applicable: true, evidence: [`${D}/spec.md:243`], summary: 'no new requirement mapping; REQ-001..REQ-031 mapped in iterations 1 and 2, REQ-032..REQ-046 pending' },
    ],
  },
  newFindingsRatio: 0.636,
  noveltyJustification: 'Seven new P2 findings against a running weighted total of 11 (eleven P2 at weight 1), so 7/11 = 0.636. None repeats an iteration 1 or 2 finding: those covered AC-036 to AC-038 and REQ-012, while these cover five count cells, two overstated-evidence cells and five anchor groups.',
  sessionId: 'fanout-deepseek-max-2-1795544069299-46zw3s',
  generation: 6,
  lineageMode: 'new',
  timestamp: ts,
  durationMs: 300000,
  graphEvents: [
    ...findings.map((f) => ({ type: 'node', id: `finding:${f.id}`, kind: 'FINDING', label: f.title })),
    ...findings.map((f) => ({ type: 'edge', id: `finding:${f.id}->dimension:traceability`, source: `finding:${f.id}`, target: 'dimension:traceability', relation: 'IN_DIMENSION' })),
  ],
};

writeFileSync(`${L}/state-events/iter-003-record.json`, `${JSON.stringify(record)}\n`);
const delta = [JSON.stringify(record)];
for (const f of findings) delta.push(JSON.stringify({ type: 'finding', id: f.id, severity: 'P2', title: f.title, file: f.file, cluster: 'acceptance-evidence', iteration: 3 }));
delta.push(JSON.stringify({ type: 'classification', detail: 'Checklist evidence pass: the Verification Summary and closure statement agree with their boxes; seven acceptance cells cite counts or lines that do not hold.', iteration: 3 }));
delta.push(JSON.stringify({ type: 'traceability_check', protocolId: 'checklist_evidence', status: 'partial', iteration: 3, evidence: 'acceptance-criteria.md:66,101; tasks.md:322' }));
delta.push(JSON.stringify({ type: 'ruled_out', direction: 'Verification Summary disagreeing with its boxes', reason: 'counted 26 CHK boxes, 12 P0 / 13 P1 / 1 P2, CHK-020 open, matching 11/12', iteration: 3 }));
writeFileSync(`${L}/deltas/iter-003.jsonl`, `${delta.join('\n')}\n`);
console.log('built iteration 3', ts);
