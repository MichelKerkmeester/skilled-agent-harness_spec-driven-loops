// Iteration 5 record + non-anchored strategy prose. Run: node .iter-005.cjs <artifactDir>
// The reducer owns the ANCHOR blocks (dimensions, counts, exhausted approaches, next focus),
// so this script only appends to the prose sections outside those anchors.
const fs = require('fs');
const path = require('path');

const L = process.argv[2];
const p = path.join(L, 'deep-review-strategy.md');
let s = fs.readFileSync(p, 'utf8');

function appendAfter(anchor, addition) {
  if (!s.includes(anchor)) throw new Error(`strategy anchor missing: ${anchor.slice(0, 60)}`);
  s = s.replace(anchor, anchor + addition);
}

appendAfter(
  '- Enumerating the code\'s diagnostic token vocabulary and diffing it against the docs: it turned a vague "docs may be thin" suspicion into a precise 3-of-8 gap (iteration 4).',
  '\n- Reading a test change against the call site it asserts, rather than against its commit message: it cleared both halves of `0390556ee2b` and left the acceptance criteria as the only place the evidence did not hold (iteration 5).',
);

appendAfter(
  '- The reference\'s line citations having drifted: all three cited ranges resolve to the code they describe (iteration 4, evidence: semantic-shadow.ts:27,325-338,405).',
  '\n- AC-005\'s "default 0 asserted by the pass bar" misstating which branch ran: the Then clause is "the default weight follows the pass bar", and the bar failed (iteration 5, evidence: acceptance-criteria.md:60).\n- AC-001\'s 14/14 and AC-011\'s 15/15 contradicting each other: they describe the fresh isolated daemon and main respectively (iteration 5, evidence: implementation-summary.md:114,123).\n- The OpenCode test change loosening its assertion to accept a wrong argument: `additionalContext` is the parameter holding the emitted text (iteration 5, evidence: user-prompt-submit.ts:516-535).\n- The Pi test change making its assertion tautological: it compares the nudge text against a path derived from the test file location, so nudge-side drift still fails (iteration 5, evidence: session-handover.test.ts:46-50).',
);

if (s.includes('| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |')) {
  s = s.replace(
    '| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |',
    '| `agent_cross_runtime` | overlay | notApplicable | 5 | No agent definition integrates the advisor status surface, so there is no agent-to-runtime pair to reconcile. |',
  );
}

appendAfter(
  '| references/scoring/advisor-scorer.md | D1 | 4 | 0 P0, 0 P1, 1 P2 | partial |',
  '\n| acceptance-criteria.md | D2 | 5 | 0 P0, 0 P1, 1 P2 | partial |',
);

fs.writeFileSync(p, s);

const rec = {
  type: 'iteration',
  iteration: 5,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-vibe-2-1795172940208-84a42n',
  status: 'complete',
  focus: 'Frontier node F-1-002: traceability',
  frontierNodeId: 'F-1-002',
  dimensions: ['traceability'],
  filesReviewed: [
    '.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:516',
    '.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:535',
    '.opencode/plugins/system-skill-advisor.js:968',
    '.opencode/plugins/tests/system-skill-advisor.test.cjs:1071',
    '.skilled/hooks/session-handover/pi/session-handover.test.ts:46',
    '.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts:261',
    '.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts:305',
    '.skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts:11',
    'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:60',
    'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:121',
  ],
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 0, P2: 1 },
  findingsNew: ['R5-P2-001'],
  findingDetails: [
    {
      id: 'R5-P2-001',
      severity: 'P2',
      title: 'AC-005 claims the shipped runs match five earlier runs while the recorded evidence covers two',
      file: 'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:60',
      dimension: 'traceability',
      findingClass: 'traceability',
      scopeProof: 'The claim is in the owning packet acceptance criteria; the contradicting evidence is in the same packet implementation summary.',
      affectedSurfaceHints: ['acceptance-criteria.md AC-005 verification cell', 'ablation audit trail', 'packet closure evidence'],
    },
  ],
  traceabilityChecks: {
    results: [
      {
        protocolId: 'spec_code',
        status: 'partial',
        gateClass: 'hard',
        applicable: true,
        evidence: [
          'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:60',
          'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:121',
        ],
        summary: 'AC-003 and AC-004 are verified by real assertions; AC-005 overstates the run set its match covers.',
      },
      {
        protocolId: 'checklist_evidence',
        status: 'pass',
        gateClass: 'hard',
        applicable: true,
        evidence: [
          'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:56',
        ],
        summary: 'Every criterion row reads Met with a named verification; no Unmet row remains.',
      },
      {
        protocolId: 'agent_cross_runtime',
        status: 'notApplicable',
        gateClass: 'overlay',
        applicable: false,
        evidence: [],
        summary: 'No agent definition integrates the advisor status surface.',
      },
    ],
  },
  newFindingsRatio: 1.0,
  noveltyJustification: 'One new finding: the AC-005 verification cell claims a match against five runs where the summary records two. Weighted new 1 over weighted total 1.',
  sessionId: 'fanout-vibe-2-1795172940208-84a42n',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 0,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: {
    scopeClass: 'complex',
    enforcement: 'strict',
    reason: 'Traceability across an acceptance criterion, an implementation summary and two test files in two runtimes.',
    evidenceRefs: ['specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:60'],
  },
  targetSelection: {
    selectedTargets: [
      '.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts',
      '.opencode/plugins/tests/system-skill-advisor.test.cjs',
      '.skilled/hooks/session-handover/pi/session-handover.test.ts',
      '.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts',
      '.skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts',
      'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md',
    ],
    selectionReason: 'Frontier node F-1-002 scope plus the packet docs that cite the two tests inside it.',
    discoveryMethods: ['direct_read', 'exact_search', 'git_show', 'frontier_scope'],
    omittedHighRiskTargets: [],
    graphStatus: 'unavailable',
    semanticSearchStatus: 'unavailable',
    evidenceRefs: ['specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:60'],
  },
  searchCoverage: {
    requiredBugClasses: ['unchecked_test', 'stale_citation', 'overstated_evidence', 'protocol_gap'],
    covered: ['unchecked_test', 'overstated_evidence'],
    ruledOut: ['stale_citation', 'protocol_gap'],
    deferred: [],
    blocked: [],
    graphCoverageMode: 'graphless_fallback',
  },
  searchLedger: [
    {
      id: 'SL-018',
      dimension: 'traceability',
      targetRefs: ['.opencode/plugins/tests/system-skill-advisor.test.cjs'],
      bugClass: 'unchecked_test',
      hypothesis: 'The widened alternation in 0390556ee2b accepts an argument that is not the emitted text.',
      searchActions: [
        { method: 'git_show', queryOrPath: '0390556ee2b', result: 'adds additionalContext to the accepted argument alternation', evidenceRefs: ['.opencode/plugins/tests/system-skill-advisor.test.cjs:1071'] },
        { method: 'direct_read', queryOrPath: 'user-prompt-submit.ts:516-535', result: 'finishAdvisorDelivery(additionalContext) calls observeEmittedAdvisorPolicy(additionalContext)', evidenceRefs: ['.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:535'] },
      ],
      disposition: 'ruled_out',
      rationale: 'additionalContext is the parameter holding the emitted text.',
      ruledOutReason: 'The argument is the emitted text under its new local name.',
    },
    {
      id: 'SL-019',
      dimension: 'traceability',
      targetRefs: ['.skilled/hooks/session-handover/pi/session-handover.test.ts'],
      bugClass: 'unchecked_test',
      hypothesis: 'The Pi test now derives its expected value from the same source as the implementation.',
      searchActions: [
        { method: 'git_show', queryOrPath: '0390556ee2b', result: 'CONTINUITY_WRITER becomes a quoted absolute path from import.meta.url', evidenceRefs: ['.skilled/hooks/session-handover/pi/session-handover.test.ts:46'] },
      ],
      disposition: 'ruled_out',
      rationale: 'The assertion still compares against the nudge text, so nudge-side drift fails.',
      ruledOutReason: 'The expected value is derived from the test file, not from the nudge.',
    },
    {
      id: 'SL-020',
      dimension: 'traceability',
      targetRefs: ['specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md'],
      bugClass: 'overstated_evidence',
      hypothesis: 'A verification cell claims more than the recorded evidence supports.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'acceptance-criteria.md:60', result: 'AC-005 says runs 8 and 9 match runs 3 to 7', evidenceRefs: ['specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:60'] },
        { method: 'direct_read', queryOrPath: 'implementation-summary.md:112-121', result: 'flip lists recorded for runs 1-2 and 3-4 only; shipped row says identical to runs 3 and 4', evidenceRefs: ['specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:121'] },
      ],
      disposition: 'finding',
      rationale: 'Runs 5, 6 and 7 have no recorded flip list, so the claimed match is unverifiable.',
      linkedFindingId: 'R5-P2-001',
    },
    {
      id: 'SL-021',
      dimension: 'traceability',
      targetRefs: ['specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md'],
      bugClass: 'stale_citation',
      hypothesis: 'AC-003 and AC-004 cite tests that do not assert the claimed behavior.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'semantic-shadow-cosine.vitest.ts:261-262,305-306', result: 'both cases assert [] and disabledReason incomplete_skill_vectors', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts:305'] },
        { method: 'direct_read', queryOrPath: 'semantic-outage-degraded.vitest.ts:11', result: 'asserts status runtime_degraded', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts:11'] },
      ],
      disposition: 'ruled_out',
      rationale: 'Both criteria are backed by direct assertions.',
      ruledOutReason: 'The cited tests assert the claimed behavior.',
    },
  ],
  graphEvents: [
    { type: 'node', id: 'FILE-acceptance-criteria', kind: 'FILE', label: 'acceptance-criteria.md' },
    { type: 'node', id: 'FINDING-R5-P2-001', kind: 'FINDING', label: 'AC-005 overstates the run set' },
    { type: 'edge', id: 'E7', source: 'FINDING-R5-P2-001', target: 'FILE-acceptance-criteria', relation: 'IN_FILE' },
  ],
};

fs.writeFileSync(path.join(L, '.iter-005-event.json'), JSON.stringify(rec));
console.log('strategy+record ok');
