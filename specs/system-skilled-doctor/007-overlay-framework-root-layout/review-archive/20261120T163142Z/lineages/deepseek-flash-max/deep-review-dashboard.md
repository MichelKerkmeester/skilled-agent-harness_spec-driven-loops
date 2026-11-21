---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: specs/system-skilled-doctor/007-overlay-framework-root-layout (spec-folder)
- Started: 2026-11-20T13:55:21.745Z
- Status: COMPLETE
- Iteration: 12 of 24
- Provisional Verdict: FAIL
- Failed required gates at stop: scope
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-flash-max-1795182837437-sws2tv
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 2 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-003: correctness | correctness | 1.00 | 0/1/1 | complete |
| 2 | Frontier node F-1-005: correctness | correctness | 1.00 | 0/1/1 | complete |
| 3 | Frontier node F-1-007: correctness | correctness | 0.00 | 0/0/0 | complete |
| 4 | Frontier node F-1-003: security | security | 0.00 | 0/0/0 | complete |
| 5 | Frontier node F-1-005: security | security | 0.00 | 0/0/0 | complete |
| 6 | Frontier node F-1-003: traceability | traceability | 1.00 | 0/0/1 | complete |
| 7 | Frontier node F-1-007: traceability | traceability | 0.00 | 0/0/0 | complete |
| 8 | Frontier node F-1-003: maintainability | maintainability | 1.00 | 0/0/1 | complete |
| 9 | Frontier node F-1-005: maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 10 | Frontier node F-1-007: maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 11 | Recovery pass: completion-criteria verification (cross-reference) | traceability | 1.00 | 0/0/1 | complete |
| 12 | Consolidation pass: executed completion criteria and closed the traceability protocol set | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 0 |
| traceability | covered | 1 |
| maintainability | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=31, ruledOut=23, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 path_containment (ruled_out): 001-engine-out-of-tree-overlay-folder/spec.md:132,226 scopes the refusal to pre-commit, and the code matches.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5814-5819
- iteration 1 state_transition (ruled_out): planLayoutLinks compares the live target with the manifest target, and both were rewritten by the same run.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6310-6328
- iteration 2 copy_drift (ruled_out): All four byte comparisons are identical.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:1-169
- iteration 2 path_resolution (ruled_out): Both candidates are covered and each rejects the other anchor.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-84
- iteration 3 copy_drift (ruled_out): Every difference is an overlay-owned entry the manifest declares.; evidence=barter/ai-speckit/overlays/overlay-manifest.json
- iteration 3 pin_record_disagreement (ruled_out): The two pin strings are identical and the changelog names the same short commit.; evidence=barter/ai-speckit/overlays/overlay-manifest.json, barter/ai-speckit/overlays/sync-state.json
- iteration 3 dangling_symlink (ruled_out): Both links resolve and their targets hold the expected changelog files.; evidence=barter/ai-speckit/skilled/.skilled/changelog/sk-git-skilled, barter/ai-speckit/skilled/.skilled/changelog/skilled-coder
- iteration 3 stale_old_layout_path (ruled_out): The old dot-dropped folder does not exist.; evidence=barter/ai-speckit/overlays/README.md:440-460
- iteration 4 symlink_escape (ruled_out): Every link case falls through to the refusal at :469 and each is pinned by a test.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:441-468
- iteration 4 path_traversal (ruled_out): Every manifest path reaches a containment test that throws or refuses before a write.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:675-681
- iteration 4 guard_scope_mismatch (ruled_out): The documented scope is the commit check, and the code refuses there.; evidence=.skilled/skills/system-skilled-doctor/references/overlays.md:51, specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:132
- iteration 4 fail_open_on_missing_input (ruled_out): Both spellings of both boundaries are refused before the copy starts.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5139-5150
- iteration 5 symlink_escape (ruled_out): All three layout conditions are name-locked and each candidate rejects the other anchor.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52-58
- iteration 5 path_traversal (ruled_out): The target reaches the engine as an absolute canonical path.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:138-158
- iteration 5 guard_scope_mismatch (ruled_out): Both copies land on <ai-speckit> and probe the same sibling manifest.; evidence=barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:178-187
- iteration 5 fail_open_on_missing_input (ruled_out): The engine probe after the rewrite fails closed with exit 1.; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:95-100
- iteration 6 requirement_code_mismatch (ruled_out): Every requirement's substance is present; only the pointers drifted.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5484-5488
- iteration 7 stale_old_layout_path (ruled_out): The grep returns zero lines, stronger than the two exceptions REQ-008 allows.; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:145
- iteration 7 pin_record_disagreement (ruled_out): No value in the files map contains barter-overlays.; evidence=barter/ai-speckit/overlays/sync-state.json
- iteration 7 unsupported_release_claim (ruled_out): The release the notes claim is the release the pin carries.; evidence=barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:310
- iteration 7 unrecorded_blocker (ruled_out): The blocker is recorded in five places and escalated rather than dropped.; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/tasks.md:68
- iteration 8 stale_command_reference (ruled_out): The command is named three times.; evidence=.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:57
- iteration 8 docs_code_drift (ruled_out): Both quote the same string.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3659
- iteration 8 docs_code_drift (ruled_out): The flag only routes to commandRelayout.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6494
- iteration 9 stale_folder_tree (ruled_out): Every folder the tree names exists and no folder it omits exists.; evidence=barter/ai-speckit/overlays/README.md:440-460
- iteration 9 docs_code_drift (ruled_out): Both examples follow the shipped rule exactly.; evidence=barter/ai-speckit/overlays/README.md:55
- iteration 9 undocumented_default (ruled_out): No default name is asserted.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:73
- iteration 9 docs_code_drift (ruled_out): The named path is the anchor the resolver matches.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-84
- iteration 10 link_map_disagreement (ruled_out): Both maps hold the same 19 entries with the same targets.; evidence=barter/ai-speckit/overlays/overlay-manifest.json, barter/ai-speckit/overlays/sync-state.json
- iteration 10 hand_maintained_link (ruled_out): layoutLinks declares both and sync-state.links records both.; evidence=barter/ai-speckit/overlays/overlay-manifest.json
- iteration 10 record_shape_gap (ruled_out): All three fields a re-pin reads are present.; evidence=barter/ai-speckit/overlays/overlay-manifest.json
- iteration 10 stale_old_layout_path (ruled_out): No link value names the pre-move folder.; evidence=barter/ai-speckit/overlays/sync-state.json
- iteration 11 stale_setting_file (ruled_out): The file holds exactly the value decision D4 requires.; evidence=barter/ai-speckit/skilled/.skilled-overlays.json
- iteration 11 criterion_failure (ruled_out): The folder does not exist.; evidence=barter/ai-speckit/skilled/barter-overlays
- iteration 11 criterion_failure (ruled_out): The criterion is satisfied in form; only the remedy is wrong.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556
- iteration 12 stale_setting_file (ruled_out): The file holds exactly { "overlayDir": "../overlays" } with no extra keys, and status --json reports overlayFolder ../overlays.; evidence=barter/ai-speckit/skilled/.skilled-overlays.json
- iteration 12 criterion_failure (ruled_out): status --json reports PASSED with offLayout [] and check 135/135; --guard exits 1 and names ../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md.; evidence=barter/ai-speckit/skilled/.skilled-overlays.json, .skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556

### Clean Search Proof
- iteration 1 path_containment (ruled_out): 001-engine-out-of-tree-overlay-folder/spec.md:132,226 scopes the refusal to pre-commit, and the code matches.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5814-5819
- iteration 1 state_transition (ruled_out): planLayoutLinks compares the live target with the manifest target, and both were rewritten by the same run.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6310-6328
- iteration 2 copy_drift (ruled_out): All four byte comparisons are identical.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:1-169
- iteration 2 path_resolution (ruled_out): Both candidates are covered and each rejects the other anchor.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-84
- iteration 3 copy_drift (ruled_out): Every difference is an overlay-owned entry the manifest declares.; evidence=barter/ai-speckit/overlays/overlay-manifest.json
- iteration 3 pin_record_disagreement (ruled_out): The two pin strings are identical and the changelog names the same short commit.; evidence=barter/ai-speckit/overlays/overlay-manifest.json, barter/ai-speckit/overlays/sync-state.json
- iteration 3 dangling_symlink (ruled_out): Both links resolve and their targets hold the expected changelog files.; evidence=barter/ai-speckit/skilled/.skilled/changelog/sk-git-skilled, barter/ai-speckit/skilled/.skilled/changelog/skilled-coder
- iteration 3 stale_old_layout_path (ruled_out): The old dot-dropped folder does not exist.; evidence=barter/ai-speckit/overlays/README.md:440-460
- iteration 4 symlink_escape (ruled_out): Every link case falls through to the refusal at :469 and each is pinned by a test.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:441-468
- iteration 4 path_traversal (ruled_out): Every manifest path reaches a containment test that throws or refuses before a write.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:675-681
- iteration 4 guard_scope_mismatch (ruled_out): The documented scope is the commit check, and the code refuses there.; evidence=.skilled/skills/system-skilled-doctor/references/overlays.md:51, specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/spec.md:132
- iteration 4 fail_open_on_missing_input (ruled_out): Both spellings of both boundaries are refused before the copy starts.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5139-5150
- iteration 5 symlink_escape (ruled_out): All three layout conditions are name-locked and each candidate rejects the other anchor.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52-58
- iteration 5 path_traversal (ruled_out): The target reaches the engine as an absolute canonical path.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:138-158
- iteration 5 guard_scope_mismatch (ruled_out): Both copies land on <ai-speckit> and probe the same sibling manifest.; evidence=barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:178-187
- iteration 5 fail_open_on_missing_input (ruled_out): The engine probe after the rewrite fails closed with exit 1.; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:95-100
- iteration 6 requirement_code_mismatch (ruled_out): Every requirement's substance is present; only the pointers drifted.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5484-5488
- iteration 7 stale_old_layout_path (ruled_out): The grep returns zero lines, stronger than the two exceptions REQ-008 allows.; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:145
- iteration 7 pin_record_disagreement (ruled_out): No value in the files map contains barter-overlays.; evidence=barter/ai-speckit/overlays/sync-state.json
- iteration 7 unsupported_release_claim (ruled_out): The release the notes claim is the release the pin carries.; evidence=barter/ai-speckit/overlays/framework/changelog/skilled-coder/v4.1.0.0.md:310
- iteration 7 unrecorded_blocker (ruled_out): The blocker is recorded in five places and escalated rather than dropped.; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/tasks.md:68
- iteration 8 stale_command_reference (ruled_out): The command is named three times.; evidence=.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:57
- iteration 8 docs_code_drift (ruled_out): Both quote the same string.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3659
- iteration 8 docs_code_drift (ruled_out): The flag only routes to commandRelayout.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6494
- iteration 9 stale_folder_tree (ruled_out): Every folder the tree names exists and no folder it omits exists.; evidence=barter/ai-speckit/overlays/README.md:440-460
- iteration 9 docs_code_drift (ruled_out): Both examples follow the shipped rule exactly.; evidence=barter/ai-speckit/overlays/README.md:55
- iteration 9 undocumented_default (ruled_out): No default name is asserted.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:73
- iteration 9 docs_code_drift (ruled_out): The named path is the anchor the resolver matches.; evidence=barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-84
- iteration 10 link_map_disagreement (ruled_out): Both maps hold the same 19 entries with the same targets.; evidence=barter/ai-speckit/overlays/overlay-manifest.json, barter/ai-speckit/overlays/sync-state.json
- iteration 10 hand_maintained_link (ruled_out): layoutLinks declares both and sync-state.links records both.; evidence=barter/ai-speckit/overlays/overlay-manifest.json
- iteration 10 record_shape_gap (ruled_out): All three fields a re-pin reads are present.; evidence=barter/ai-speckit/overlays/overlay-manifest.json
- iteration 10 stale_old_layout_path (ruled_out): No link value names the pre-move folder.; evidence=barter/ai-speckit/overlays/sync-state.json
- iteration 11 stale_setting_file (ruled_out): The file holds exactly the value decision D4 requires.; evidence=barter/ai-speckit/skilled/.skilled-overlays.json
- iteration 11 criterion_failure (ruled_out): The folder does not exist.; evidence=barter/ai-speckit/skilled/barter-overlays
- iteration 11 criterion_failure (ruled_out): The criterion is satisfied in form; only the remedy is wrong.; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556
- iteration 12 stale_setting_file (ruled_out): The file holds exactly { "overlayDir": "../overlays" } with no extra keys, and status --json reports overlayFolder ../overlays.; evidence=barter/ai-speckit/skilled/.skilled-overlays.json
- iteration 12 criterion_failure (ruled_out): status --json reports PASSED with offLayout [] and check 135/135; --guard exits 1 and names ../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md.; evidence=barter/ai-speckit/skilled/.skilled-overlays.json, .skilled/commands/doctor/scripts/overlay-engine.cjs:5552-5556

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 3 nodes (0 open, 0 active, 3 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 10 of 12 iterations spent
- Budget depth2: 0 of 10.4 iterations spent
- Budget depth3: 0 of 14 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: cross-reference - Focus area: synthesis -- group the seven open findings by root cause and state the verdict the registry supports - Reason: the frontier is drained, all four dimensions are covered, and both core traceability protocols now pass on executed evidence, so no review work remains inside the loop - Rotation status: all three nodes answered on all four dimensions; consolidation pass complete - Blocked/productive carry-forward: productive -- executing the criteria rather than reading about them is what closed `checklist_evidence`, and it is the same move that found `R11-P2-001` in iteration 11 - Required evidence: the findings registry, the seven open findings, and the strategy's exhausted-approach list Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
