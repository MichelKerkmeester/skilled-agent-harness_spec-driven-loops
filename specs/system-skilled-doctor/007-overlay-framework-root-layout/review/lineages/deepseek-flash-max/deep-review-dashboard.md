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
- Started: 2026-11-20T16:34:32.390Z
- Status: COMPLETE
- Iteration: 9 of 24
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-deepseek-flash-max-1795192401900-xpt66n
- Parent Session: 2026-11-20T16:33:02.758Z
- Lifecycle Mode: new
- Generation: 2
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 10 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-002: correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | Frontier node F-1-002: security | security | 0.50 | 0/0/1 | complete |
| 3 | Frontier node F-1-004: correctness | correctness | 0.33 | 0/0/1 | complete |
| 4 | Frontier node F-1-006: correctness | correctness | 0.25 | 0/0/1 | complete |
| 5 | Frontier node F-1-004: security | security | 0.33 | 0/0/2 | complete |
| 6 | Frontier node F-1-006: security | security | 0.14 | 0/0/1 | complete |
| 7 | Frontier node F-1-002: traceability | traceability | 0.13 | 0/0/1 | complete |
| 8 | Frontier node F-1-004: maintainability | maintainability | 0.11 | 0/0/1 | complete |
| 9 | Frontier node F-1-006: traceability, closing the checklist_evidence core protocol | traceability | 0.10 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 4 |
| traceability | covered | 3 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
### Iteration 10 — blocked by [coverage]
- Recovery: Amend 003-engine-docs-and-release/goal.md:62 so its third clause excludes assets/ or anchors the opt-in pattern to the layout rule, which makes the tick reproducible and closes checklist_evidence; then re-run /deep:review. The second cause is an authority limit: validate.sh --recursive --strict is outside this lineage's write surface.
- Gate results: 0: ?, 1: ?, 2: ?
- Timestamp: 2026-11-20T17:21:02.773Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.13 -> 0.11 -> 0.10
- convergenceScore: 0.90
- openFindings: 10
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
- candidateCoverage: covered=12, ruledOut=20, deferred=3, blocked=0

### Search Debt
- iteration 0 frontier:F-1-002 (deferred): frontier node open; evidence=frontier-nodes.jsonl#F-1-002
- iteration 0 frontier:F-1-004 (deferred): frontier node open; evidence=frontier-nodes.jsonl#F-1-004
- iteration 0 frontier:F-1-006 (deferred): frontier node open; evidence=frontier-nodes.jsonl#F-1-006

### Ruled-Out Candidates
- iteration 1 partial-failure (ruled_out): verified by direct read and by the injected-failure tests; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6534-6560, .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1206
- iteration 1 path_traversal (ruled_out): verified by direct read and by the refusal tests; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:470-476, .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:838
- iteration 2 guard_bypass (ruled_out): verified by direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:4181, .skilled/commands/doctor/scripts/overlay-engine.cjs:6124
- iteration 2 secret_exposure (ruled_out): verified by direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:2755
- iteration 3 fail_open (ruled_out): verified by direct read and by the new tests; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:120-146, barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs:107-116
- iteration 3 test_gap (ruled_out): verified by direct read; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs:107
- iteration 4 pin_mismatch (ruled_out): verified by byte diff; evidence=barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs, barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/references/overlays.md
- iteration 4 leftover_reference (ruled_out): verified by exact search; evidence=barter/ai-speckit/README.md:135
- iteration 5 path_traversal (ruled_out): verified by direct read of the canonicalisation and invocation paths; evidence=barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:170, barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:77
- iteration 5 fail_open (ruled_out): verified by reading all four adapter entrypoints; evidence=barter/ai-speckit/skilled/.skilled/hooks/overlay-guard/claude/overlay-guard.cjs:71-74
- iteration 6 shell_injection (ruled_out): verified by direct read of the invocation helper; evidence=barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4228
- iteration 6 secret_leak (ruled_out): verified by exact search; evidence=barter/ai-speckit/overlays/sync-state.json
- iteration 6 supply_chain_drift (ruled_out): verified by listing the tests folder; evidence=barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs
- iteration 7 doc_code_drift (ruled_out): verified by direct read of the throw site and the exit constant; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:91
- iteration 7 missing_remedy (ruled_out): verified by reading both sides branch for branch; evidence=.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:118
- iteration 7 broken_cross_reference (ruled_out): verified by direct read of each named surface; evidence=.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:51
- iteration 8 duplicated_logic (ruled_out): recorded as an edge case instead of a finding; evidence=barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:26
- iteration 8 regressed_fix (ruled_out): verified by direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3435
- iteration 8 stale_comment (ruled_out): verified by listing both trees and reading both tests; evidence=barter/ai-speckit/skilled/.opencode/plugins/lib/v2-bridge.js, barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs:176
- iteration 9 unexecuted_criterion (ruled_out): executed read-only with no repository residue; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs:63, .skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs:63
- iteration 9 regressed_criterion (ruled_out): re-executed read-only; evidence=barter/ai-speckit/skilled/.skilled-overlays.json:1

### Clean Search Proof
- iteration 1 partial-failure (ruled_out): verified by direct read and by the injected-failure tests; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:6534-6560, .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1206
- iteration 1 path_traversal (ruled_out): verified by direct read and by the refusal tests; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:470-476, .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:838
- iteration 2 guard_bypass (ruled_out): verified by direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:4181, .skilled/commands/doctor/scripts/overlay-engine.cjs:6124
- iteration 2 secret_exposure (ruled_out): verified by direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:2755
- iteration 3 fail_open (ruled_out): verified by direct read and by the new tests; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:120-146, barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs:107-116
- iteration 3 test_gap (ruled_out): verified by direct read; evidence=barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs:107
- iteration 4 pin_mismatch (ruled_out): verified by byte diff; evidence=barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs, barter/ai-speckit/skilled/.skilled/skills/system-skilled-doctor/references/overlays.md
- iteration 4 leftover_reference (ruled_out): verified by exact search; evidence=barter/ai-speckit/README.md:135
- iteration 5 path_traversal (ruled_out): verified by direct read of the canonicalisation and invocation paths; evidence=barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:170, barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:77
- iteration 5 fail_open (ruled_out): verified by reading all four adapter entrypoints; evidence=barter/ai-speckit/skilled/.skilled/hooks/overlay-guard/claude/overlay-guard.cjs:71-74
- iteration 6 shell_injection (ruled_out): verified by direct read of the invocation helper; evidence=barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4228
- iteration 6 secret_leak (ruled_out): verified by exact search; evidence=barter/ai-speckit/overlays/sync-state.json
- iteration 6 supply_chain_drift (ruled_out): verified by listing the tests folder; evidence=barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs
- iteration 7 doc_code_drift (ruled_out): verified by direct read of the throw site and the exit constant; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:91
- iteration 7 missing_remedy (ruled_out): verified by reading both sides branch for branch; evidence=.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:118
- iteration 7 broken_cross_reference (ruled_out): verified by direct read of each named surface; evidence=.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md:51
- iteration 8 duplicated_logic (ruled_out): recorded as an edge case instead of a finding; evidence=barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:26
- iteration 8 regressed_fix (ruled_out): verified by direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3435
- iteration 8 stale_comment (ruled_out): verified by listing both trees and reading both tests; evidence=barter/ai-speckit/skilled/.opencode/plugins/lib/v2-bridge.js, barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs:176
- iteration 9 unexecuted_criterion (ruled_out): executed read-only with no repository residue; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs:63, .skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs:63
- iteration 9 regressed_criterion (ruled_out): re-executed read-only; evidence=barter/ai-speckit/skilled/.skilled-overlays.json:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 3 nodes (3 open, 0 active, 0 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 9 of 12 iterations spent
- Budget depth2: 0 of 8.4 iterations spent
- Budget depth3: 0 of 12 iterations spent
- Active node: F-1-002 (maintainability)

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Frontier node F-1-002 (depth 1, scope .skilled/commands/doctor/scripts/overlay-engine.cjs, .skilled/commands/doctor/scripts/tests): Follow-up on engine path safety and remedies: does resolveOverlayDir now refuse a sibling overlay folder outside the git repository on every command (prior R1-P2-001 at :452), is overlayOutside on the context set and read consistently, and are the LAYOUT overflow remedy (prior :3658) and the strict-write replace-versus-remove remedy (prior :5552) branched correctly? Check the remaining prior engine maintainability findings (:3398, :4582, :4603) and any regression the new branches add. - review the maintainability dimension

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- Latest blocked_stop at run 10: coverage. Recovery: Amend 003-engine-docs-and-release/goal.md:62 so its third clause excludes assets/ or anchors the opt-in pattern to the layout rule, which makes the tick reproducible and closes checklist_evidence; then re-run /deep:review. The second cause is an authority limit: validate.sh --recursive --strict is outside this lineage's write surface..
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
