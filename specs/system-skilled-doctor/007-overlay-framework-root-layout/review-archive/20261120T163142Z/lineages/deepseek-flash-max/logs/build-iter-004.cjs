const fs = require('fs');
const L = 'specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max';
const ts = new Date().toISOString();
const rec = {
  type: 'iteration', iteration: 4, mode: 'review', target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  status: 'complete',
  focus: 'Frontier node F-1-003: security',
  frontierNodeId: 'F-1-003',
  dimensions: ['security'],
  filesReviewed: [
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:426-470',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:675-681',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:6082-6091',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:5136-5151',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:5528-5570',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:4128-4160',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:165-235',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:4054',
    '.skilled/commands/doctor/scripts/overlay-engine.cjs:5790-5820',
    '.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs:105-205',
    '.skilled/skills/system-skilled-doctor/references/overlays.md:51,96,259',
    'specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:132,202,226',
    'specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/acceptance-criteria.md:67'
  ],
  findingsCount: 0,
  findingsSummary: { P0: 0, P1: 0, P2: 0 },
  findingsNew: [],
  findingDetails: [],
  traceabilityChecks: { results: [
    { protocolId: 'spec_code', status: 'pass', gateClass: 'hard', applicable: true, evidence: ['specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:132', '.skilled/commands/doctor/scripts/overlay-engine.cjs:5790-5820', '.skilled/skills/system-skilled-doctor/references/overlays.md:51'], summary: 'REQ-008 scopes the same-repository refusal to pre-commit, the code enforces it there, and the reference documents it at that scope.' },
    { protocolId: 'checklist_evidence', status: 'pass', gateClass: 'hard', applicable: true, evidence: ['specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/acceptance-criteria.md:67', 'specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/scratch/evidence/after-engine-suite.txt:154-155'], summary: 'AC-008 cites both pre-commit cases by file and line and the recorded suite output shows both passing.' }
  ] },
  newFindingsRatio: 0.0,
  noveltyJustification: 'No new findings. The sibling gate, the source containment, the stage-folder refusal and the destination guards all held, and the one apparent gap (a sibling outside the repository) is the documented pre-commit scope rather than a defect. weightedNew is 0, so the ratio is 0.0.',
  sessionId: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
  generation: 1,
  lineageMode: 'new',
  timestamp: ts,
  durationMs: 191000,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: { scopeClass: 'complex', enforcement: 'strict', reason: 'Five path guards in a 6544-line engine, each with a documented refusal contract and a test matrix to check against.', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:426-470', '.skilled/commands/doctor/scripts/overlay-engine.cjs:5136-5151'] },
  targetSelection: { selectedTargets: ['.skilled/commands/doctor/scripts/overlay-engine.cjs', '.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs', '.skilled/skills/system-skilled-doctor/references/overlays.md'], selectionReason: 'The frontier node F-1-003 scope names the engine and its tests; the reference was added because the security contract is documented there and a code-only read cannot tell a defect from a documented scope.', discoveryMethods: ['direct_read', 'exact_search', 'git_log_pickaxe'], omittedHighRiskTargets: [], graphStatus: 'unavailable', semanticSearchStatus: 'unavailable', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:441-468'] },
  searchCoverage: { requiredBugClasses: ['path_traversal', 'symlink_escape', 'guard_scope_mismatch', 'fail_open_on_missing_input'], covered: ['path_traversal', 'symlink_escape', 'guard_scope_mismatch', 'fail_open_on_missing_input'], ruledOut: ['path_traversal', 'symlink_escape', 'guard_scope_mismatch', 'fail_open_on_missing_input'], deferred: [], blocked: [], graphCoverageMode: 'graphless_fallback' },
  searchLedger: [
    { id: 'SL-013', dimension: 'security', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'symlink_escape', hypothesis: 'A sibling overlayDir spelled as a link can steer the engine outside the tree', searchActions: [{ method: 'direct_read', queryOrPath: 'resolveOverlayDir:441-468 plus the link cases at overlay-engine-fixes.test.cjs:130-190', result: 'canonical comparison both ways; link back to tree, dangling link, self-loop and case variant all refused', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:441-468'] }], disposition: 'ruled_out', ruledOutReason: 'Every link case falls through to the refusal at :469 and each is pinned by a test.', rationale: 'The gate resolves links rather than trusting the spelling.' },
    { id: 'SL-014', dimension: 'security', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'path_traversal', hypothesis: 'A manifest source or destination can escape the overlay folder or the tree', searchActions: [{ method: 'direct_read', queryOrPath: 'sourceRelative:675-681, containedOverlayPath:6082-6091, destination guards at :174, :199, :229, :4054', result: 'sourceRelative throws on escape; destinations refused lexically and through the canonical parent', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:675-681'] }], disposition: 'ruled_out', ruledOutReason: 'Every manifest path reaches a containment test that throws or refuses before a write.', rationale: 'Containment is applied at the point of use, not only at load.' },
    { id: 'SL-015', dimension: 'security', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'guard_scope_mismatch', hypothesis: 'The same-repository refusal is documented as unconditional but implemented only for the commit check', searchActions: [{ method: 'direct_read', queryOrPath: 'references/overlays.md:51 vs stagedUnownedChanges:5806-5818 vs spec.md:132,226', result: 'the reference, REQ-008 and the operator resolution all scope it to pre-commit; the code matches', evidenceRefs: ['.skilled/skills/system-skilled-doctor/references/overlays.md:51', 'specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:132'] }], disposition: 'ruled_out', ruledOutReason: 'The documented scope is the commit check, and the code refuses there.', rationale: 'A code-only read would have called this a defect; the reference and the spec settle it.' },
    { id: 'SL-016', dimension: 'security', targetRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs'], bugClass: 'fail_open_on_missing_input', hypothesis: 'repin --stage can be aimed inside the tree or inside the overlay folder', searchActions: [{ method: 'direct_read', queryOrPath: 'stageFolderProblem:5139-5150', result: 'refuses both boundaries by lexical and canonical path, plus non-folder and non-empty targets', evidenceRefs: ['.skilled/commands/doctor/scripts/overlay-engine.cjs:5139-5150'] }], disposition: 'ruled_out', ruledOutReason: 'Both spellings of both boundaries are refused before the copy starts.', rationale: 'The stage refusal is the one guard that already resolves links.' }
  ],
  graphEvents: [
    { type: 'node', id: 'N-F1-003', kind: 'SLICE', label: 'Frontier node F-1-003 engine layout and path safety' },
    { type: 'node', id: 'N-RESOLVEDIR', kind: 'FILE', label: 'resolveOverlayDir sibling gate' },
    { type: 'node', id: 'N-STAGEGUARD', kind: 'FILE', label: 'stageFolderProblem' },
    { type: 'node', id: 'N-SOURCEREL', kind: 'FILE', label: 'sourceRelative containment' },
    { type: 'edge', id: 'E-12', source: 'N-F1-003', target: 'N-RESOLVEDIR', relation: 'COVERS' },
    { type: 'edge', id: 'E-13', source: 'N-F1-003', target: 'N-STAGEGUARD', relation: 'COVERS' },
    { type: 'edge', id: 'E-14', source: 'N-F1-003', target: 'N-SOURCEREL', relation: 'COVERS' }
  ]
};
fs.writeFileSync('/tmp/iter-004-event.json', JSON.stringify(rec));
const lines = [JSON.stringify(rec)];
lines.push(JSON.stringify({ type: 'classification', detail: 'no new findings; sibling gate, source containment, stage refusal and destination guards all held', iteration: 4 }));
lines.push(JSON.stringify({ type: 'traceability_check', protocolId: 'spec_code', status: 'pass', iteration: 4 }));
lines.push(JSON.stringify({ type: 'traceability_check', protocolId: 'checklist_evidence', status: 'pass', iteration: 4 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a sibling overlayDir can point the engine at a folder outside the git repository', reason: 'references/overlays.md:51, spec.md:132 and spec.md:226 all scope the same-repository rule to pre-commit, and the engine refuses there at :5810-5818', iteration: 4 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a manifest source, fragment or base can escape the overlay folder', reason: 'containedOverlayPath routes every one through sourceRelative, which throws on an escape, and planRelayout turns the throw into a refuse: problem before any write', iteration: 4 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'a symlinked parent can carry a removal outside the tree', reason: ':229 compares the canonical parent, not just the lexical path', iteration: 4 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'repin --stage can be aimed inside the tree or inside the overlay folder', reason: 'stageFolderProblem tests both spellings of both boundaries', iteration: 4 }));
lines.push(JSON.stringify({ type: 'ruled_out', direction: 'the overlayDir key is read anywhere but the setting reader', reason: 'overlay-engine-fixes.test.cjs:193-205 asserts every occurrence sits inside resolveOverlayDir', iteration: 4 }));
fs.writeFileSync(L + '/deltas/iter-004.jsonl', lines.join('\n') + '\n');
console.log('wrote event + delta, lines=' + lines.length + ' ts=' + ts);
