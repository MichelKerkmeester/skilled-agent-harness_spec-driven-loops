const fs = require('fs');
const L = 'specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max';
const rec = {
  type: 'iteration', iteration: 1, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  status: 'complete',
  focus: 'Frontier node F-1-003: correctness',
  frontierNodeId: 'F-1-003',
  dimensions: ['correctness'],
  filesReviewed: [
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:426-478',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:2776-2786',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:3406-3436',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:3595-3672',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:5482-5492',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:5630-5670',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:6071-6404',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:6466-6510',
    '.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:899-1740',
    '.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:765-830',
    '.skilled/skills/system-skilled-doctor/SKILL.md:5',
    '.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:16,29,33,51,57',
    'specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:88,130,134,167,183,192',
    'specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/spec.md:183',
    'specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/implementation-summary.md:53-70'
  ],
  findingsCount: 2,
  findingsSummary: { P0: 0, P1: 1, P2: 1 },
  findingsNew: ['R1-P1-001', 'R1-P2-001'],
  findingDetails: [
    { id: 'R1-P1-001', severity: 'P1', title: 'Relayout leaves a half-moved overlay folder when a rename or the manifest write fails after the first move', dimension: 'correctness', file: '.skilled/commands/doctor/scripts/overlay-engine.cjs:6384-6392', findingClass: 'incomplete-implementation', scopeProof: 'inside the declared review target engine file; names the statements that violate the invariant the same function declares', affectedSurfaceHints: ['overlay-engine.cjs relayout path', 'relayout-runs backup contract', 'changelog/v1.2.0.0.md:57'] },
    { id: 'R1-P2-001', severity: 'P2', title: 'The LAYOUT overflow line advises apply --relayout even when the entries it counts are ones relayout refuses', dimension: 'correctness', file: '.skilled/commands/doctor/scripts/overlay-engine.cjs:3658-3660', findingClass: 'diagnostic-gap', scopeProof: 'inside the declared review target engine file; names the two statements whose remedies disagree', affectedSurfaceHints: ['status LAYOUT output', 'changelog/v1.2.0.0.md:29', 'overlay-engine.cjs:6136-6141'] }
  ],
  traceabilityChecks: { results: [
    { protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true, evidence: ['specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:88', '.skilled/commands/doctor/scripts/overlay-engine.cjs:426-478'], summary: 'The sibling gate, the staged layout and the relayout backup paths match REQ-006 and REQ-010 as written.' },
    { protocolId: 'checklist_evidence', status: 'pass', gateClass: 'hard', applicable: true, evidence: ['specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/tasks.md:42'], summary: 'Every checked task carries an observed result or a Verify command output.' }
  ] },
  newFindingsRatio: 1.0,
  noveltyJustification: 'Both findings are new to this run and neither refines an earlier one: the relayout rollback gap and the LAYOUT overflow remedy are the first findings recorded, so weightedNew equals weightedTotal and the ratio is 1.0.',
  sessionId: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  generation: 1,
  lineageMode: 'new',
  timestamp: '2026-11-20T13:58:02.545Z',
  durationMs: 161000,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: { scopeClass: 'complex', enforcement: 'strict', reason: 'A 6544-line engine plus six test suites and five phase specs, touching path resolution, filesystem mutation and a migration path.', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:6071-6404'] },
  targetSelection: { selectedTargets: ['.skilled/commands/doctor/scripts/overlay-engine.cjs', '.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs', '.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs'], selectionReason: 'The frontier node F-1-003 scope names the engine and its tests; the layout and relayout code paths are the ones the operator focus calls out.', discoveryMethods: ['direct_read', 'exact_search', 'frontier_scope'], omittedHighRiskTargets: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:1-426 (constants and helpers outside the layout path)'], graphStatus: 'unavailable', semanticSearchStatus: 'unavailable', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:3406-3436'] },
  searchCoverage: { requiredBugClasses: ['state_transition', 'partial_failure', 'diagnostic_consistency', 'path_containment'], covered: ['partial_failure', 'diagnostic_consistency'], ruledOut: ['path_containment', 'state_transition'], deferred: [], blocked: [], graphCoverageMode: 'graphless_fallback' },
  searchLedger: [
    { id: 'SL-001', dimension: 'correctness', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'partial_failure', hypothesis: 'A relayout that fails part-way leaves copies at their layout paths behind a manifest naming the old ones', searchActions: [{ method: 'direct_read', queryOrPath: 'overlay-engine.cjs:6334-6404', result: 'the try/catch wraps only planRelayoutManifest; the rename loop and the manifest write are unguarded', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:6362-6367', '.skilled/commands/doctor/scripts/overlay-engine.cjs:6384-6392'] }], disposition: 'finding', linkedFindingId: 'R1-P1-001', rationale: 'The function own comment states the invariant and only one of three failure points enforces it.' },
    { id: 'SL-002', dimension: 'correctness', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'diagnostic_consistency', hypothesis: 'The LAYOUT overflow line gives the same advice for entries relayout refuses', searchActions: [{ method: 'direct_read', queryOrPath: 'overlay-engine.cjs:3652-3661', result: 'the per-line remedy branches on isUnderRootSkilled; the overflow line does not', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:3652-3660'] }], disposition: 'finding', linkedFindingId: 'R1-P2-001', rationale: 'Two lines that share one remedy decision disagree about it.' },
    { id: 'SL-003', dimension: 'correctness', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'path_containment', hypothesis: 'resolveOverlayDir accepts a sibling that escapes the git repository', searchActions: [{ method: 'direct_read', queryOrPath: 'overlay-engine.cjs:426-478,5814-5819', result: 'the git-repository refusal is implemented in stagedUnownedChanges, which is where the child spec scopes it', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:5814-5819'] }], disposition: 'ruled_out', ruledOutReason: '001-engine-out-of-tree-overlay-folder/spec.md:132,226 scopes the refusal to pre-commit, and the code matches.', rationale: 'Spec and code agree; only the decision summary is looser.' },
    { id: 'SL-004', dimension: 'correctness', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'state_transition', hypothesis: 'status fails after a relayout until a follow-up apply runs', searchActions: [{ method: 'direct_read', queryOrPath: 'overlay-engine.cjs:2908,6310-6328,6280-6288,2473-2479', result: 'state.files holds hashes only, and the live link and the manifest target move together', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:6310-6328'] }], disposition: 'ruled_out', ruledOutReason: 'planLayoutLinks compares the live target with the manifest target, and both were rewritten by the same run.', rationale: 'No stale state survives the relayout.' }
  ],
  graphEvents: [
    { type: 'node', id: 'N-F1-003', kind: 'SLICE', label: 'Frontier node F-1-003 overlay layout' },
    { type: 'node', id: 'N-ENGINE', kind: 'FILE', label: 'overlay-engine.cjs' },
    { type: 'node', id: 'N-RELAYOUT', kind: 'PRODUCER', label: 'relayoutUnderLock' },
    { type: 'node', id: 'N-STATUS', kind: 'PRODUCER', label: 'commandStatus LAYOUT notice' },
    { type: 'node', id: 'N-R1-P1-001', kind: 'FINDING', label: 'relayout partial failure' },
    { type: 'node', id: 'N-R1-P2-001', kind: 'FINDING', label: 'LAYOUT overflow remedy' },
    { type: 'edge', id: 'E-1', source: 'N-F1-003', target: 'N-ENGINE', relation: 'COVERS' },
    { type: 'edge', id: 'E-2', source: 'N-RELAYOUT', target: 'N-R1-P1-001', relation: 'EVIDENCE_FOR' },
    { type: 'edge', id: 'E-3', source: 'N-STATUS', target: 'N-R1-P2-001', relation: 'EVIDENCE_FOR' },
    { type: 'edge', id: 'E-4', source: 'N-R1-P1-001', target: 'N-F1-003', relation: 'IN_DIMENSION' }
  ]
};
fs.writeFileSync('/tmp/iter-001-event.json', JSON.stringify(rec));
const lines = [JSON.stringify(rec)];
lines.push(JSON.stringify({ type: 'finding', id: 'R1-P1-001', severity: 'P1', title: 'Relayout leaves a half-moved overlay folder when a rename or the manifest write fails after the first move', file: '.skilled/commands/doctor/scripts/overlay-engine.cjs:6384-6392', iteration: 1 }));
lines.push(JSON.stringify({ type: 'finding', id: 'R1-P2-001', severity: 'P2', title: 'The LAYOUT overflow line advises apply --relayout even when the entries it counts are ones relayout refuses', file: '.skilled/commands/doctor/scripts/overlay-engine.cjs:3658-3660', iteration: 1 }));
lines.push(JSON.stringify({ type: 'classification', detail: 'R1-P1-001 incomplete-implementation P1 confidence medium; R1-P2-001 diagnostic-gap P2', iteration: 1 }));
lines.push(JSON.stringify({ type: 'traceability_check', protocolId: 'spec_code', status: 'pass', iteration: 1 }));
lines.push(JSON.stringify({ type: 'traceability_check', protocolId: 'checklist_evidence', status: 'pass', iteration: 1 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'overlayDir outside the git repository is not refused by resolveOverlayDir', reason: 'the refusal is scoped to pre-commit by 001-engine-out-of-tree-overlay-folder/spec.md:132,226 and implemented at overlay-engine.cjs:5814-5819', iteration: 1 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'repin --stage copies relayout-runs and repin-runs into the stage', reason: 'recorded as an accepted cost under NFR-P01 in 001-engine-out-of-tree-overlay-folder/spec.md:183', iteration: 1 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a marked-section entry whose source differs from its fragment keeps a permanent LAYOUT line', reason: 'layoutMoves skips that source and status prints from the same function', iteration: 1 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'status fails after a relayout until a follow-up apply', reason: 'state.files holds hashes only and the live link and manifest target move together', iteration: 1 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'two destinations collapsing onto one source path', reason: 'planRelayout claimed map refuses with both source paths named', iteration: 1 }));
fs.writeFileSync(L + '/deltas/iter-001.jsonl', lines.join('\n') + '\n');
console.log('wrote event + delta, lines=' + lines.length);
