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
- Started: 2026-11-20T13:54:53.963Z
- Status: COMPLETE
- Iteration: 17 of 24
- Provisional Verdict: FAIL
- Failed required gates at stop: scope
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-opus-medium-1795182837437-sws2tv
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

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
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-002: correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | Frontier node F-1-004: correctness | correctness | 0.50 | 0/0/1 | complete |
| 3 | Frontier node F-1-006: correctness | correctness | 0.50 | 0/0/2 | complete |
| 4 | Frontier node F-1-008: correctness | correctness | 0.20 | 0/0/1 | complete |
| 5 | Frontier node F-1-002: security | security | 0.08 | 0/0/1 | complete |
| 6 | Frontier node F-1-004: security | security | 0.00 | 0/0/0 | complete |
| 7 | Frontier node F-1-006: security | security | 0.00 | 0/0/0 | complete |
| 8 | Frontier node F-1-008: security | security | 0.00 | 0/0/0 | complete |
| 9 | Frontier node F-1-002: traceability | traceability | 0.00 | 0/0/0 | complete |
| 10 | Frontier node F-1-004: traceability | traceability | 0.00 | 0/0/0 | complete |
| 11 | Frontier node F-1-006: traceability | traceability | 0.00 | 0/0/0 | complete |
| 12 | Frontier node F-1-008: traceability | traceability | 0.17 | 0/0/1 | complete |
| 13 | maintainability | maintainability | 0.25 | 0/0/2 | complete |
| 14 | maintainability | maintainability | 0.11 | 0/0/1 | complete |
| 15 | correctness recheck of open findings | correctness | 0.00 | 0/0/0 | complete |
| 16 | correctness stabilization pass | correctness | 0.00 | 0/0/0 | complete |
| 17 | maintainability recovery pass | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 0 |
| traceability | covered | 1 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 9
- persistentSameSeverity: 1
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graph
- candidateCoverage: covered=9, ruledOut=17, deferred=0, blocked=4

### Search Debt
- iteration 1 frontier:F-1-002 (blocked): frontier node closed exhausted (budget) short of its dimensions; evidence=frontier-nodes.jsonl#F-1-002
- iteration 2 frontier:F-1-004 (blocked): frontier node closed exhausted (budget) short of its dimensions; evidence=frontier-nodes.jsonl#F-1-004
- iteration 3 frontier:F-1-006 (blocked): frontier node closed exhausted (budget) short of its dimensions; evidence=frontier-nodes.jsonl#F-1-006
- iteration 4 frontier:F-1-008 (blocked): frontier node closed exhausted (budget) short of its dimensions; evidence=frontier-nodes.jsonl#F-1-008

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by grep and direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:4588
- iteration 1 test_strength (ruled_out): negative control evidence plus code reading; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/implementation-summary.md:90
- iteration 2 playbook_signal (ruled_out): indented output; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3636
- iteration 3 fail_open (ruled_out): catch allows with stderr note; evidence=barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:41
- iteration 4 pin_mismatch (ruled_out): verified; evidence=barter/ai-speckit/overlays/overlay-manifest.json:1
- iteration 5 guard_bypass (ruled_out): verified by reading; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:4148
- iteration 5 fail_open (ruled_out): matches stated policy; evidence=.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:107
- iteration 6 path_traversal (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5340
- iteration 6 command_injection (ruled_out): no shell path in code; evidence=.skilled/commands/doctor/assets/doctor-overlay-repin.yaml:107
- iteration 7 root_detection (ruled_out): verified; evidence=barter/ai-speckit/skilled/.vibe/plugins/repo-guards/barter-git-write-gate.mjs:1
- iteration 7 fail_open (ruled_out): verified; evidence=barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:41
- iteration 8 secret_exposure (ruled_out): scan clean; home paths are a repo-wide convention; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/scratch/evidence/baseline-engine-suite.txt:13
- iteration 9 test_strength (ruled_out): verified by reading; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:202
- iteration 9 spec_drift (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:2824
- iteration 10 cross_reference_drift (ruled_out): verified; evidence=.skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md:201
- iteration 11 leftover_reference (ruled_out): verified; evidence=barter/ai-speckit/README.md:135
- iteration 12 completion_claim (ruled_out): verified; evidence=barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:58
- iteration 15 severity_calibration (ruled_out): reach rule keeps P2; evidence=barter/ai-speckit/.gitignore:68
- iteration 16 path_traversal (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3962
- iteration 16 doc_code_drift (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1766
- iteration 17 readability (ruled_out): verified; evidence=.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:196

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by grep and direct read; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:4588
- iteration 1 test_strength (ruled_out): negative control evidence plus code reading; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/implementation-summary.md:90
- iteration 2 playbook_signal (ruled_out): indented output; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3636
- iteration 3 fail_open (ruled_out): catch allows with stderr note; evidence=barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:41
- iteration 4 pin_mismatch (ruled_out): verified; evidence=barter/ai-speckit/overlays/overlay-manifest.json:1
- iteration 5 guard_bypass (ruled_out): verified by reading; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:4148
- iteration 5 fail_open (ruled_out): matches stated policy; evidence=.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:107
- iteration 6 path_traversal (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:5340
- iteration 6 command_injection (ruled_out): no shell path in code; evidence=.skilled/commands/doctor/assets/doctor-overlay-repin.yaml:107
- iteration 7 root_detection (ruled_out): verified; evidence=barter/ai-speckit/skilled/.vibe/plugins/repo-guards/barter-git-write-gate.mjs:1
- iteration 7 fail_open (ruled_out): verified; evidence=barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:41
- iteration 8 secret_exposure (ruled_out): scan clean; home paths are a repo-wide convention; evidence=specs/system-skilled-doctor/007-overlay-framework-root-layout/001-engine-out-of-tree-overlay-folder/scratch/evidence/baseline-engine-suite.txt:13
- iteration 9 test_strength (ruled_out): verified by reading; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:202
- iteration 9 spec_drift (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:2824
- iteration 10 cross_reference_drift (ruled_out): verified; evidence=.skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md:201
- iteration 11 leftover_reference (ruled_out): verified; evidence=barter/ai-speckit/README.md:135
- iteration 12 completion_claim (ruled_out): verified; evidence=barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md:58
- iteration 15 severity_calibration (ruled_out): reach rule keeps P2; evidence=barter/ai-speckit/.gitignore:68
- iteration 16 path_traversal (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/overlay-engine.cjs:3962
- iteration 16 doc_code_drift (ruled_out): verified; evidence=.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1766
- iteration 17 readability (ruled_out): verified; evidence=.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:196

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 4 nodes (0 open, 0 active, 0 answered, 4 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 12 of 12 iterations spent
- Budget depth2: 0 of 8.4 iterations spent
- Budget depth3: 0 of 12 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: none outstanding - Reason: recovery pass found no new issue; synthesis when convergence allows Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
