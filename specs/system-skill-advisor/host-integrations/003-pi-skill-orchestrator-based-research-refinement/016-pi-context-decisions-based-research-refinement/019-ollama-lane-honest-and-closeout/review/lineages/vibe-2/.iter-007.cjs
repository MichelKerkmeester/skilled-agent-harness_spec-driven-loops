// Iteration 7 record + non-anchored strategy prose. Run: node .iter-007.cjs <artifactDir>
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
  '- Comparing every surface that quotes a measurement against the one table that records it: it found a superseded score pair the earlier row-count finding had walked past (iteration 6).',
  '\n- Reading a guard\'s input back to its assignment instead of trusting its name: it turned a suspected behavior bug into a precise naming hazard (iteration 7).',
);

appendAfter(
  '- The playbook pass-bar sentence contradicting D2: it states the fail branch, which is what ran (iteration 6, evidence: manual-testing-playbook/scorer-fusion/ablation.md:60).',
  '\n- The lane weight guard ignoring the operator override: the constant it reads is the resolved weights, and a test stubs the env to prove the lane proceeds (iteration 7, evidence: lane-registry.ts:74-105).\n- `_semanticShadowTest` exposing internals being a defect: it is a named test hook, not a production surface (iteration 7, evidence: semantic-shadow.ts:245-248).\n- The lane health object being a hidden global callers must know to read: the tests read it deliberately and the status handler surfaces it (iteration 7, evidence: advisor-status.ts:534).',
);

appendAfter(
  '| .skilled/changelog/skilled/v4.1.0.0.md | D2 | 2, 6 | 0 P0, 0 P1, 3 P2 | partial |',
  '\n| runtime/lib/scorer/lane-registry.ts | D2 | 7 | 0 P0, 0 P1, 1 P2 | partial |',
);

fs.writeFileSync(p, s);

const rec = {
  type: 'iteration',
  iteration: 7,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-vibe-2-1795172940208-84a42n',
  status: 'complete',
  focus: 'Frontier node F-1-002: maintainability',
  frontierNodeId: 'F-1-002',
  dimensions: ['maintainability'],
  filesReviewed: [
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:170',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:74',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:105',
    '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:493',
    '.skilled/skills/system-skill-advisor/runtime/tests/semantic-lane-weight-zero.vitest.ts:72',
    '.skilled/skills/system-skill-advisor/runtime/tests/semantic-lane-weight-zero.vitest.ts:80',
    '.skilled/skills/system-skill-advisor/runtime/tests/semantic-prompt-embedding-degrade.vitest.ts:170',
  ],
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 0, P2: 1 },
  findingsNew: ['R7-P2-001'],
  findingDetails: [
    {
      id: 'R7-P2-001',
      severity: 'P2',
      title: 'The lane weight guard reads a constant named DEFAULT_SCORER_LANE_WEIGHTS that actually holds the resolved live weights',
      file: '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156',
      dimension: 'maintainability',
      findingClass: 'maintainability',
      scopeProof: 'The guard is in the declared target semantic-shadow.ts; the constant definition is in the same declared target tree.',
      affectedSurfaceHints: ['withSemanticShadowPromptEmbedding', 'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON opt-in', 'semantic-lane-weight-zero.vitest.ts', 'lane weight resolution'],
    },
  ],
  traceabilityChecks: {
    results: [
      {
        protocolId: 'spec_code',
        status: 'pass',
        gateClass: 'hard',
        applicable: true,
        evidence: [
          '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156',
          '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:105',
        ],
        summary: 'The guard behavior matches the documented opt-in; only the constant name misdescribes its content.',
      },
      {
        protocolId: 'checklist_evidence',
        status: 'pass',
        gateClass: 'hard',
        applicable: true,
        evidence: [
          'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:56',
        ],
        summary: 'No Unmet row.',
      },
      {
        protocolId: 'agent_cross_runtime',
        status: 'notApplicable',
        gateClass: 'overlay',
        applicable: false,
        evidence: [],
        summary: 'No agent definition integrates the advisor surface.',
      },
    ],
  },
  newFindingsRatio: 1.0,
  noveltyJustification: 'One new finding: the constant feeding the lane weight guard is named as a default but holds the resolved weights. Weighted new 1 over weighted total 1.',
  sessionId: 'fanout-vibe-2-1795172940208-84a42n',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 0,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: {
    scopeClass: 'complex',
    enforcement: 'strict',
    reason: 'A load-bearing guard whose correctness depends on the reader knowing what its input holds.',
    evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156'],
  },
  targetSelection: {
    selectedTargets: [
      '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts',
      '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts',
      '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts',
      '.skilled/skills/system-skill-advisor/runtime/tests/semantic-lane-weight-zero.vitest.ts',
      '.skilled/skills/system-skill-advisor/runtime/tests/semantic-prompt-embedding-degrade.vitest.ts',
    ],
    selectionReason: 'Frontier node F-1-002 scope: the lane module, its weight registry and the tests that pin the guard.',
    discoveryMethods: ['direct_read', 'exact_search', 'frontier_scope'],
    omittedHighRiskTargets: [],
    graphStatus: 'unavailable',
    semanticSearchStatus: 'unavailable',
    evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156'],
  },
  searchCoverage: {
    requiredBugClasses: ['misleading_name', 'implicit_invariant', 'untested_identity', 'dead_code'],
    covered: ['misleading_name', 'untested_identity'],
    ruledOut: ['implicit_invariant', 'dead_code'],
    deferred: [],
    blocked: [],
    graphCoverageMode: 'graphless_fallback',
  },
  searchLedger: [
    {
      id: 'SL-026',
      dimension: 'maintainability',
      targetRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts'],
      bugClass: 'misleading_name',
      hypothesis: 'The weight guard reads a default constant and so ignores the operator override.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'semantic-shadow.ts:156', result: 'guard reads DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:156'] },
        { method: 'direct_read', queryOrPath: 'lane-registry.ts:74-105', result: 'DEFAULT_SCORER_LANE_WEIGHTS = RESOLVED_WEIGHTS = resolveLaneWeightsOverride(LIVE_LANE_WEIGHTS_ENV_KEY, DEFAULT_WEIGHTS)', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:105'] },
        { method: 'direct_read', queryOrPath: 'semantic-lane-weight-zero.vitest.ts:80', result: 'stubs the env to 0.05 and asserts the lane proceeds', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/tests/semantic-lane-weight-zero.vitest.ts:80'] },
      ],
      disposition: 'finding',
      rationale: 'Behavior is correct; the name invites a fix that would break the opt-in.',
      linkedFindingId: 'R7-P2-001',
    },
    {
      id: 'SL-027',
      dimension: 'maintainability',
      targetRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts'],
      bugClass: 'implicit_invariant',
      hypothesis: 'The module-level prompt embedding races across concurrent calls.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'semantic-shadow.ts:236-252', result: 'set, synchronous run and finally clear share one microtask', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236'] },
      ],
      disposition: 'ruled_out',
      rationale: 'No await between set and clear.',
      ruledOutReason: 'The window is synchronous.',
    },
    {
      id: 'SL-028',
      dimension: 'maintainability',
      targetRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts'],
      bugClass: 'dead_code',
      hypothesis: 'The test hook export is unused production surface.',
      searchActions: [
        { method: 'exact_search', queryOrPath: '_semanticShadowTest across runtime tests', result: 'used by the cosine test for cosineSimilarity and fixtureVector', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245'] },
      ],
      disposition: 'ruled_out',
      rationale: 'It is a named test hook with live consumers.',
      ruledOutReason: 'Consumed by the cosine test.',
    },
  ],
  graphEvents: [
    { type: 'node', id: 'FINDING-R7-P2-001', kind: 'FINDING', label: 'Misnamed resolved-weights constant' },
    { type: 'edge', id: 'E9', source: 'FINDING-R7-P2-001', target: 'file:.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts', relation: 'IN_FILE' },
  ],
};

fs.writeFileSync(path.join(L, '.iter-007-event.json'), JSON.stringify(rec));
console.log('strategy+record ok');
