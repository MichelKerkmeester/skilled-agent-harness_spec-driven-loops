const fs = require('fs');
const L = 'specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max';
const rec = {
  type: 'iteration', iteration: 2, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  status: 'complete',
  focus: 'Frontier node F-1-005: correctness',
  frontierNodeId: 'F-1-005',
  dimensions: ['correctness'],
  filesReviewed: [
    'barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:1-169',
    'barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:1-50',
    'barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:1-155',
    'barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs:147-220',
    'barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:160-215',
    'barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:1-120',
    'barter/ai-speckit/overlays/README.md:40,47,234',
    'barter/ai-speckit/overlays/framework/scripts/git-hooks/README.md:24,113',
    'barter/ai-speckit/overlays/overlay-manifest.json:716-720',
    'specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:53,54,64,67,108-115'
  ],
  findingsCount: 2,
  findingsSummary: { P0: 0, P1: 1, P2: 1 },
  findingsNew: ['R2-P1-001', 'R2-P2-001'],
  findingDetails: [
    { id: 'R2-P1-001', severity: 'P1', title: 'The commit gate silently skips every overlay check when the overlay folder is not found', dimension: 'correctness', file: 'barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-92', findingClass: 'fail-open-without-signal', scopeProof: 'inside the declared review target Barter overlay tree; names the exact branch that suppresses the gate', affectedSurfaceHints: ['pre-commit overlay block', 'overlays/README.md:47', 'overlay-manifest.json:716-720'] },
    { id: 'R2-P2-001', severity: 'P2', title: 'No test covers the pre-commit git hook overlay lookup or its skip branch', dimension: 'correctness', file: 'barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-116', findingClass: 'test-gap', scopeProof: 'inside the declared review target Barter overlay tree; names the untested statements and the search that proves no test exists', affectedSurfaceHints: ['pre-commit overlay block', '005-barter-move-overlays-out-of-tree/spec.md:111', 'overlay-manifest.json:716-720'] }
  ],
  traceabilityChecks: { results: [
    { protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true, evidence: ['specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:108-111', 'barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-84'], summary: 'All three hooks resolve the folder at the path the spec file table names, and the two resolvers agree on both copies.' },
    { protocolId: 'checklist_evidence', status: 'partial', gateClass: 'hard', applicable: true, evidence: ['specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:111'], summary: 'The spec hook-test row names no pre-commit test and none exists, so the commit gate migration has no recorded evidence.' }
  ] },
  newFindingsRatio: 1.0,
  noveltyJustification: 'Both findings are new: the commit gate silent skip and its missing test were not raised in iteration 1, which reviewed the engine rather than the hooks. weightedNew equals weightedTotal, so the ratio is 1.0.',
  sessionId: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  generation: 1,
  lineageMode: 'new',
  timestamp: '2026-11-20T14:00:19.361Z',
  durationMs: 137000,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: { scopeClass: 'complex', enforcement: 'strict', reason: 'Three hooks across two runtimes plus their tests and the Barter overlay manifest, with a fail-open/fail-closed contract to judge.', evidenceRefs: ['barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-116'] },
  targetSelection: { selectedTargets: ['barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs', 'barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js', 'barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs', 'barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit'], selectionReason: 'The frontier node F-1-005 scope names the overlay folder, the OpenCode plugins and the sk-git hook; the pre-commit hook is the third hook the phase 005 spec names.', discoveryMethods: ['direct_read', 'exact_search', 'byte_diff'], omittedHighRiskTargets: ['barter/ai-speckit/overlays/repin-runs (run history, not hook source)'], graphStatus: 'unavailable', semanticSearchStatus: 'unavailable', evidenceRefs: ['barter/ai-speckit/overlays/overlay-manifest.json:716-720'] },
  searchCoverage: { requiredBugClasses: ['fail_open_without_signal', 'path_resolution', 'copy_drift', 'test_gap'], covered: ['fail_open_without_signal', 'test_gap'], ruledOut: ['path_resolution', 'copy_drift'], deferred: [], blocked: [], graphCoverageMode: 'graphless_fallback' },
  searchLedger: [
    { id: 'SL-005', dimension: 'correctness', targetRefs: ['barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit'], bugClass: 'fail_open_without_signal', hypothesis: 'The commit gate skips its overlay checks with no diagnostic when the folder is missing', searchActions: [{ method: 'direct_read', queryOrPath: 'pre-commit:85-118', result: 'HAS_OVERLAYS stays 0 and the block is skipped, then exit 0 with no output', evidenceRefs: ['barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:89-92', 'barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:118'] }], disposition: 'finding', linkedFindingId: 'R2-P1-001', rationale: 'The phase 005 spec names this as the defect and the fix leaves it in place.' },
    { id: 'SL-006', dimension: 'correctness', targetRefs: ['barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit'], bugClass: 'test_gap', hypothesis: 'No test exercises the pre-commit hook overlay lookup', searchActions: [{ method: 'exact_search', queryOrPath: 'rg -l HAS_OVERLAYS barter/ai-speckit --glob !specs/** --glob !**/repin-runs/**', result: 'only the hook itself', evidenceRefs: ['barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-116'] }], disposition: 'finding', linkedFindingId: 'R2-P2-001', rationale: 'The phase modified the hook path resolution and the spec hook-test row names no test for it.' },
    { id: 'SL-007', dimension: 'correctness', targetRefs: ['barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs'], bugClass: 'copy_drift', hypothesis: 'The overlay source and the vendored copy of a hook file disagree', searchActions: [{ method: 'byte_diff', queryOrPath: 'diff overlay source vendored copy for four hook files', result: 'all four diffs empty', evidenceRefs: ['barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:1-169'] }], disposition: 'ruled_out', ruledOutReason: 'All four byte comparisons are identical.', rationale: 'The re-pin and the relayout kept the copies in step.' },
    { id: 'SL-008', dimension: 'correctness', targetRefs: ['barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js'], bugClass: 'path_resolution', hypothesis: 'The guard core cannot resolve the overlay folder from the overlay source copy', searchActions: [{ method: 'direct_read', queryOrPath: 'barter-overlay-guard-core.cjs:60-84', result: 'candidate 2 matches the overlay source anchor and candidate 1 matches the applied anchor', evidenceRefs: ['barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-84'] }], disposition: 'ruled_out', ruledOutReason: 'Both candidates are covered and each rejects the other anchor.', rationale: 'One candidate per copy covers both without a scan.' }
  ],
  graphEvents: [
    { type: 'node', id: 'N-F1-005', kind: 'SLICE', label: 'Frontier node F-1-005 Barter hooks' },
    { type: 'node', id: 'N-PRECOMMIT', kind: 'PRODUCER', label: 'Barter pre-commit commit gate' },
    { type: 'node', id: 'N-GUARDCORE', kind: 'FILE', label: 'barter-overlay-guard-core.cjs' },
    { type: 'node', id: 'N-R2-P1-001', kind: 'FINDING', label: 'commit gate silent skip' },
    { type: 'node', id: 'N-R2-P2-001', kind: 'FINDING', label: 'pre-commit test gap' },
    { type: 'edge', id: 'E-5', source: 'N-F1-005', target: 'N-GUARDCORE', relation: 'COVERS' },
    { type: 'edge', id: 'E-6', source: 'N-PRECOMMIT', target: 'N-R2-P1-001', relation: 'EVIDENCE_FOR' },
    { type: 'edge', id: 'E-7', source: 'N-PRECOMMIT', target: 'N-R2-P2-001', relation: 'EVIDENCE_FOR' },
    { type: 'edge', id: 'E-8', source: 'N-R2-P1-001', target: 'N-F1-005', relation: 'IN_DIMENSION' }
  ]
};
fs.writeFileSync('/tmp/iter-002-event.json', JSON.stringify(rec));
const lines = [JSON.stringify(rec)];
lines.push(JSON.stringify({ type: 'finding', id: 'R2-P1-001', severity: 'P1', title: 'The commit gate silently skips every overlay check when the overlay folder is not found', file: 'barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-92', iteration: 2 }));
lines.push(JSON.stringify({ type: 'finding', id: 'R2-P2-001', severity: 'P2', title: 'No test covers the pre-commit git hook overlay lookup or its skip branch', file: 'barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:85-116', iteration: 2 }));
lines.push(JSON.stringify({ type: 'classification', detail: 'R2-P1-001 fail-open-without-signal P1 confidence medium; R2-P2-001 test-gap P2', iteration: 2 }));
lines.push(JSON.stringify({ type: 'traceability_check', protocolId: 'spec_code', status: 'pass', iteration: 2 }));
lines.push(JSON.stringify({ type: 'traceability_check', protocolId: 'checklist_evidence', status: 'partial', iteration: 2 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'the guard fail-open on a missing overlay folder is a defect', reason: 'documented at barter-overlay-guard.js:19-23, pinned by barter-overlay-guard.test.cjs:121-155, recorded as pre-existing at 005-barter-move-overlays-out-of-tree/spec.md:64', iteration: 2 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'the vendored and overlay copies of the four hook files disagree', reason: 'all four diff runs are empty', iteration: 2 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'the pre-commit repo-root branch mis-resolves the tree', reason: 'the probe at :85 rewrites TREE_ROOT to ai-speckit/skilled and :89 then finds the manifest beside it', iteration: 2 }));
fs.writeFileSync(L + '/deltas/iter-002.jsonl', lines.join('\n') + '\n');
console.log('wrote event + delta, lines=' + lines.length);
