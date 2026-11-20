// Iteration 6 record + non-anchored strategy prose. Run: node .iter-006.cjs <artifactDir>
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
  '- Reading a test change against the call site it asserts, rather than against its commit message: it cleared both halves of `0390556ee2b` and left the acceptance criteria as the only place the evidence did not hold (iteration 5).',
  '\n- Comparing every surface that quotes a measurement against the one table that records it: it found a superseded score pair the earlier row-count finding had walked past (iteration 6).',
);

appendAfter(
  '- The Pi test change making its assertion tautological: it compares the nudge text against a path derived from the test file location, so nudge-side drift still fails (iteration 5, evidence: session-handover.test.ts:46-50).',
  '\n- The feature catalog ablation leaf still claiming an `advisor_validate` slice: it states the corrected negative claim (iteration 6, evidence: ablation.md:22).\n- `runLaneAblation` being described as honouring lane weights: the leaf says it ignores weights and includes lanes already at 0 (iteration 6, evidence: ablation.md:22).\n- The install guide overstating the lane benefit: it says a measured run routed fewer prompts correctly with the lane on (iteration 6, evidence: INSTALL-SKILLED.md:88).\n- The playbook pass-bar sentence contradicting D2: it states the fail branch, which is what ran (iteration 6, evidence: manual-testing-playbook/scorer-fusion/ablation.md:60).',
);

appendAfter(
  '| acceptance-criteria.md | D2 | 5 | 0 P0, 0 P1, 1 P2 | partial |',
  '\n| .skilled/changelog/skilled/v4.1.0.0.md | D2 | 2, 6 | 0 P0, 0 P1, 3 P2 | partial |',
);

fs.writeFileSync(p, s);

const rec = {
  type: 'iteration',
  iteration: 6,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-vibe-2-1795172940208-84a42n',
  status: 'complete',
  focus: 'Frontier node F-1-005: traceability',
  frontierNodeId: 'F-1-005',
  dimensions: ['traceability'],
  filesReviewed: [
    '.skilled/changelog/skilled/v4.1.0.0.md:222',
    '.skilled/changelog/skilled/v4.1.0.0.md:225',
    '.skilled/changelog/skilled/v4.1.0.0.md:231',
    '.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:22',
    '.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:24',
    '.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:60',
    '.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:51',
    '.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:118',
    'INSTALL-SKILLED.md:88',
    'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:112',
  ],
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 0, P2: 1 },
  findingsNew: ['R6-P2-001'],
  findingDetails: [
    {
      id: 'R6-P2-001',
      severity: 'P2',
      title: 'The changelog records two different ablation score pairs for the same lane, and the first appears nowhere in the packet ablation table',
      file: '.skilled/changelog/skilled/v4.1.0.0.md:222',
      dimension: 'traceability',
      findingClass: 'traceability',
      scopeProof: 'The claim is in the declared target changelog; the contradicting evidence is the packet ablation table cited as traceability context.',
      affectedSurfaceHints: ['v4.1.0.0.md Ollama section', 'operator reading the cost of enabling the lane', 'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON guidance'],
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
          '.skilled/changelog/skilled/v4.1.0.0.md:222',
          'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:112',
        ],
        summary: 'Three of four ablation surfaces match the table; the changelog first sentence records a superseded pair.',
      },
      {
        protocolId: 'checklist_evidence',
        status: 'pass',
        gateClass: 'hard',
        applicable: true,
        evidence: [
          'specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:56',
        ],
        summary: 'No Unmet row; AC-005 and AC-010 both read Met.',
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
  noveltyJustification: 'One new finding: the changelog records a superseded ablation score pair that contradicts the same file eleven lines later. Weighted new 1 over weighted total 1.',
  sessionId: 'fanout-vibe-2-1795172940208-84a42n',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 0,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: {
    scopeClass: 'complex',
    enforcement: 'strict',
    reason: 'A measurement quoted across four documentation surfaces, reconciled against one recorded table.',
    evidenceRefs: ['.skilled/changelog/skilled/v4.1.0.0.md:222'],
  },
  targetSelection: {
    selectedTargets: [
      '.skilled/changelog/skilled/v4.1.0.0.md',
      '.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md',
      '.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md',
      '.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md',
      '.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md',
      'INSTALL-SKILLED.md',
    ],
    selectionReason: 'Frontier node F-1-005 scope: every documentation surface that quotes the ablation measurement.',
    discoveryMethods: ['exact_search', 'direct_read', 'frontier_scope'],
    omittedHighRiskTargets: [],
    graphStatus: 'unavailable',
    semanticSearchStatus: 'unavailable',
    evidenceRefs: ['.skilled/changelog/skilled/v4.1.0.0.md:222'],
  },
  searchCoverage: {
    requiredBugClasses: ['stale_measurement', 'contradictory_doc', 'unsupported_claim', 'missing_supersession'],
    covered: ['stale_measurement', 'contradictory_doc', 'missing_supersession'],
    ruledOut: ['unsupported_claim'],
    deferred: [],
    blocked: [],
    graphCoverageMode: 'graphless_fallback',
  },
  searchLedger: [
    {
      id: 'SL-022',
      dimension: 'traceability',
      targetRefs: ['.skilled/changelog/skilled/v4.1.0.0.md'],
      bugClass: 'stale_measurement',
      hypothesis: 'A documentation surface quotes an ablation score pair the packet table does not record.',
      searchActions: [
        { method: 'exact_search', queryOrPath: '156|161|149|150|193|196|ablation across references, feature-catalog, changelog', result: 'changelog:222 quotes 149 of 193 against 150; changelog:231 quotes 156 against 161', evidenceRefs: ['.skilled/changelog/skilled/v4.1.0.0.md:222'] },
        { method: 'direct_read', queryOrPath: 'implementation-summary.md:112-113,121', result: 'table records 158 vs 161 and 156 vs 161; no run scored 149 or 150', evidenceRefs: ['specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:112'] },
      ],
      disposition: 'finding',
      rationale: 'The first sentence is a pre-fix measurement with no supersession marker.',
      linkedFindingId: 'R6-P2-001',
    },
    {
      id: 'SL-023',
      dimension: 'traceability',
      targetRefs: ['.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md'],
      bugClass: 'unsupported_claim',
      hypothesis: 'The catalog leaf still claims an advisor_validate ablation slice or that runLaneAblation honours weights.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'ablation.md:22', result: 'says runLaneAblation ignores weights and advisor_validate returns no slice', evidenceRefs: ['.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:22'] },
      ],
      disposition: 'ruled_out',
      rationale: 'Both statements are the corrected negative claims.',
      ruledOutReason: 'The leaf states the shipped behavior.',
    },
    {
      id: 'SL-024',
      dimension: 'traceability',
      targetRefs: ['.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md'],
      bugClass: 'contradictory_doc',
      hypothesis: 'The playbook pass-bar sentence contradicts D2.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'ablation.md:60', result: 'states 156 against 161, default stays 0, test asserts the default follows the pass bar', evidenceRefs: ['.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:60'] },
      ],
      disposition: 'ruled_out',
      rationale: 'That is D2 fail branch, which is what ran.',
      ruledOutReason: 'The playbook matches the decision.',
    },
    {
      id: 'SL-025',
      dimension: 'traceability',
      targetRefs: ['INSTALL-SKILLED.md'],
      bugClass: 'unsupported_claim',
      hypothesis: 'The install guide overstates the lane benefit.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'INSTALL-SKILLED.md:88', result: 'says a measured run routed fewer prompts correctly with the lane on', evidenceRefs: ['INSTALL-SKILLED.md:88'] },
      ],
      disposition: 'ruled_out',
      rationale: 'The guide states the shipped weight and the reason without a score pair.',
      ruledOutReason: 'No number to drift.',
    },
  ],
  graphEvents: [
    { type: 'node', id: 'FINDING-R6-P2-001', kind: 'FINDING', label: 'Superseded ablation score pair in changelog' },
    { type: 'edge', id: 'E8', source: 'FINDING-R6-P2-001', target: 'FILE--skilled-changelog-skilled-v4-1-0-0-md', relation: 'IN_FILE' },
  ],
};

fs.writeFileSync(path.join(L, '.iter-006-event.json'), JSON.stringify(rec));
console.log('strategy+record ok');
