// Iteration 8 record + non-anchored strategy prose. Run: node .iter-008.cjs <artifactDir>
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
  '- Reading a guard\'s input back to its assignment instead of trusting its name: it turned a suspected behavior bug into a precise naming hazard (iteration 7).',
  '\n- Reading the older changelog for a claim already recorded as wrong: it found the duplication that made the single-file findings survive a fix (iteration 8).',
);

appendAfter(
  '- The lane health object being a hidden global callers must know to read: the tests read it deliberately and the status handler surfaces it (iteration 7, evidence: advisor-status.ts:534).',
  '\n- The feature catalog index undercounting its leaves: the row says 10 and the directory holds 10 (iteration 8, evidence: feature-catalog.md:29).\n- The playbook index pointing at a missing scenario file: `scorer-fusion/ablation.md` exists (iteration 8, evidence: manual-testing-playbook.md:281).\n- The older changelog\'s ablation numbers being stale: they match the packet table (iteration 8, evidence: changelog/v1.3.0.0.md:33).\n- The older changelog describing a refresh that no longer ships: the described refresh matches the shipped one (iteration 8, evidence: changelog/v1.3.0.0.md:22).',
);

appendAfter(
  '| runtime/lib/scorer/lane-registry.ts | D2 | 7 | 0 P0, 0 P1, 1 P2 | partial |',
  '\n| .skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md | D1, D2 | 8 | 0 P0, 0 P1, 1 P2 | partial |',
);

fs.writeFileSync(p, s);

const rec = {
  type: 'iteration',
  iteration: 8,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-vibe-2-1795172940208-84a42n',
  status: 'complete',
  focus: 'Frontier node F-1-005: maintainability',
  frontierNodeId: 'F-1-005',
  dimensions: ['maintainability'],
  filesReviewed: [
    '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:22',
    '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:24',
    '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:25',
    '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:26',
    '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:33',
    '.skilled/changelog/skilled/v4.1.0.0.md:229',
    '.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:80',
    '.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:29',
    '.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:281',
  ],
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 0, P2: 1 },
  findingsNew: ['R8-P2-001'],
  findingDetails: [
    {
      id: 'R8-P2-001',
      severity: 'P2',
      title: 'Two claims already recorded as wrong are stated again in the older changelog, so fixing one file leaves the other',
      file: '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:26',
      dimension: 'maintainability',
      findingClass: 'maintainability',
      scopeProof: 'Both copies are inside the declared target: v1.3.0.0.md is in the F-1-005 scope and v4.1.0.0.md and advisor-scorer.md are declared target entries.',
      affectedSurfaceHints: ['changelog/v1.3.0.0.md', 'changelog/skilled/v4.1.0.0.md', 'references/scoring/advisor-scorer.md', 'launcher DB directory documentation', 'disabledReason vocabulary'],
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
          '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:26',
          '.skilled/changelog/skilled/v4.1.0.0.md:229',
          '.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:80',
        ],
        summary: 'Two claims are duplicated across files; both copies are wrong in the same way.',
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
  noveltyJustification: 'One new finding: two claims recorded as wrong in one file are stated again in another, so a single-file fix leaves the wrong copy. Weighted new 1 over weighted total 1.',
  sessionId: 'fanout-vibe-2-1795172940208-84a42n',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 0,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: {
    scopeClass: 'complex',
    enforcement: 'strict',
    reason: 'A duplicated documentation claim spanning two changelogs and a scoring reference.',
    evidenceRefs: ['.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:26'],
  },
  targetSelection: {
    selectedTargets: [
      '.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md',
      '.skilled/changelog/skilled/v4.1.0.0.md',
      '.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md',
      '.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md',
      '.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md',
    ],
    selectionReason: 'Frontier node F-1-005 scope: the older changelog plus the index surfaces that must stay consistent with their directories.',
    discoveryMethods: ['exact_search', 'direct_read', 'frontier_scope'],
    omittedHighRiskTargets: [],
    graphStatus: 'unavailable',
    semanticSearchStatus: 'unavailable',
    evidenceRefs: ['.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:26'],
  },
  searchCoverage: {
    requiredBugClasses: ['duplicated_claim', 'index_drift', 'stale_measurement', 'broken_reference'],
    covered: ['duplicated_claim'],
    ruledOut: ['index_drift', 'stale_measurement', 'broken_reference'],
    deferred: [],
    blocked: [],
    graphCoverageMode: 'graphless_fallback',
  },
  searchLedger: [
    {
      id: 'SL-029',
      dimension: 'maintainability',
      targetRefs: ['.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md'],
      bugClass: 'duplicated_claim',
      hypothesis: 'A claim recorded as wrong in one file is stated again in another.',
      searchActions: [
        { method: 'exact_search', queryOrPath: 'SYSTEM_SKILL_ADVISOR_DB_DIR and incomplete_skill_vectors across changelogs and references', result: 'v1.3.0.0.md:26 repeats the DB_DIR claim; v1.3.0.0.md:24 repeats the token claim', evidenceRefs: ['.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:26'] },
        { method: 'direct_read', queryOrPath: 'v4.1.0.0.md:229 and advisor-scorer.md:80', result: 'the same two claims, already recorded as R2-P2-001 and R4-P2-001', evidenceRefs: ['.skilled/changelog/skilled/v4.1.0.0.md:229'] },
      ],
      disposition: 'finding',
      rationale: 'Each claim has two homes and no single source of truth.',
      linkedFindingId: 'R8-P2-001',
    },
    {
      id: 'SL-030',
      dimension: 'maintainability',
      targetRefs: ['.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md'],
      bugClass: 'index_drift',
      hypothesis: 'The catalog index leaf count disagrees with the directory.',
      searchActions: [
        { method: 'exact_search', queryOrPath: 'ls feature-catalog/scorer-fusion/*.md', result: '10 leaves; index row states 10 and names all 10 topics', evidenceRefs: ['.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:29'] },
      ],
      disposition: 'ruled_out',
      rationale: 'Count and topic list both match.',
      ruledOutReason: 'No drift.',
    },
    {
      id: 'SL-031',
      dimension: 'maintainability',
      targetRefs: ['.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md'],
      bugClass: 'broken_reference',
      hypothesis: 'The playbook index points at a scenario file that does not exist.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'manual-testing-playbook.md:281', result: 'SC-005 maps to scorer-fusion/ablation.md, which exists', evidenceRefs: ['.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:281'] },
      ],
      disposition: 'ruled_out',
      rationale: 'The target file exists.',
      ruledOutReason: 'Reference resolves.',
    },
    {
      id: 'SL-032',
      dimension: 'maintainability',
      targetRefs: ['.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md'],
      bugClass: 'stale_measurement',
      hypothesis: 'The older changelog quotes ablation numbers that no longer hold.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'changelog/v1.3.0.0.md:33', result: '196-row corpus, 156 at 0.05, 161 disabled, 7 flips, default 0', evidenceRefs: ['.skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md:33'] },
      ],
      disposition: 'ruled_out',
      rationale: 'Matches the packet table.',
      ruledOutReason: 'Numbers are current.',
    },
  ],
  graphEvents: [
    { type: 'node', id: 'FINDING-R8-P2-001', kind: 'FINDING', label: 'Duplicated wrong claims across changelogs' },
    { type: 'edge', id: 'E10', source: 'FINDING-R8-P2-001', target: 'FILE--skilled-skills-system-skill-advisor', relation: 'IN_FILE' },
  ],
};

fs.writeFileSync(path.join(L, '.iter-008-event.json'), JSON.stringify(rec));
console.log('strategy+record ok');
