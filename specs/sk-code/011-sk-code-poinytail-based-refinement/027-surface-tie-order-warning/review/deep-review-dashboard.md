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
- Review Target: commit a682c06d3d on branch worktrees/131-tieorder-warning (diff c62d7d1399..a682c06d3d): doctor check 5l in parent-skill-check.cjs reports, on the sk-code hub only and as a softFail, any surface mode listed after sk-code-opencode in routerPolicy.tieBreak other than sk-code-obsidian and sk-code-webflow, naming the two fixes; three invariant tests and an addNamedSurfaces fixture helper pin it; the section heading range reads 5a-5l; the root README sk-code guide gains one sentence for a hand edit of tieBreak (files)
- Started: 2026-10-13T15:53:35.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-10-13T15:53:35.000Z
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
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 0.33 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.25 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.20 | 0/0/1 | complete |
| 5 | correctness | correctness | 0.17 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 0 |
| traceability | covered | 0 |
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
- Last 3 ratios: 0.25 -> 0.20 -> 0.17
- convergenceScore: 0.83
- openFindings: 6
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
- candidateCoverage: covered=12, ruledOut=15, deferred=2, blocked=0

### Search Debt
- iteration 1 live_integration (deferred): iteration tool-call budget; live-hub confirmation deferred to the traceability iteration; evidence=specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/review/deep-review-strategy.md:140, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:487-493
- iteration 4 duplicate_logic (deferred): call budget; pre-existing helper body not re-opened; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:243

### Ruled-Out Candidates
- iteration 1 boundary_condition (ruled_out): verified by direct read against shipped, user-added, examples-removed and examples-reordered orders; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1167, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170
- iteration 1 malformed_input (ruled_out): normalization precedes the call site; early returns cover absent values; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1329, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166
- iteration 1 duplicate_entries (ruled_out): duplicate tieBreak entries are reported by 5e before 5l's line appears; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1082
- iteration 1 hub_scoping (ruled_out): same scoping pattern used by existing hub-specific checks; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1211, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1311
- iteration 1 spec_mismatch (ruled_out): verified by direct read of the message template; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1173, specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:103
- iteration 2 unsafe_deserialization (ruled_out): no new parse, merge, or prototype-touching site; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1329
- iteration 2 resource_exhaustion (ruled_out): O(n) single pass bounded by registry size; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1167-1171
- iteration 2 path_traversal (ruled_out): no filesystem or write effect in the check; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1165-1177
- iteration 2 secret_exposure (ruled_out): no secret-bearing source is read; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1173
- iteration 2 check_bypass (ruled_out): evasion needs coherent edits to the repo's own registry and router; the exit status stays operator-visible; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1080-1087
- iteration 3 spec_mismatch (ruled_out): Verified by direct read of the target diff and both authority documents.; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1166, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173, README.md:1468
- iteration 4 mirror_parity (ruled_out): repo-wide sweep found no duplicate producer; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1165, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:243
- iteration 4 stale_reference (ruled_out): no live stale citation remains; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1019, specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:77
- iteration 5 spec_mismatch (ruled_out): every edge-case clause is realized in code; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1166, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1168, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171
- iteration 5 boundary_condition (ruled_out): filter proves the non-overlap; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1152, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1171
- iteration 5 evidence_gap (ruled_out): the pins exist; the residual message-wording gap is already R1-P2-002; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:482-483, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:491-492, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:499-500

### Clean Search Proof
- iteration 1 boundary_condition (ruled_out): verified by direct read against shipped, user-added, examples-removed and examples-reordered orders; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1167, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170
- iteration 1 malformed_input (ruled_out): normalization precedes the call site; early returns cover absent values; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1329, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166
- iteration 1 duplicate_entries (ruled_out): duplicate tieBreak entries are reported by 5e before 5l's line appears; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1082
- iteration 1 hub_scoping (ruled_out): same scoping pattern used by existing hub-specific checks; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1211, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1311
- iteration 1 spec_mismatch (ruled_out): verified by direct read of the message template; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1173, specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:103
- iteration 2 unsafe_deserialization (ruled_out): no new parse, merge, or prototype-touching site; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1329
- iteration 2 resource_exhaustion (ruled_out): O(n) single pass bounded by registry size; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1167-1171
- iteration 2 path_traversal (ruled_out): no filesystem or write effect in the check; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1165-1177
- iteration 2 secret_exposure (ruled_out): no secret-bearing source is read; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1173
- iteration 2 authz_bypass (not_applicable): no auth/authz surface exists in the doctor (CHK-032); evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:154
- iteration 2 check_bypass (ruled_out): evasion needs coherent edits to the repo's own registry and router; the exit status stays operator-visible; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1080-1087
- iteration 3 spec_mismatch (ruled_out): Verified by direct read of the target diff and both authority documents.; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1166, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173, README.md:1468
- iteration 3 doc_code_drift (not_applicable): No overlay artifact in the diff.; evidence=commit c62d7d1399..a682c06d3d
- iteration 4 mirror_parity (ruled_out): repo-wide sweep found no duplicate producer; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1165, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:243
- iteration 4 stale_reference (ruled_out): no live stale citation remains; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1019, specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md:77
- iteration 5 spec_mismatch (ruled_out): every edge-case clause is realized in code; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1166, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1168, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171
- iteration 5 boundary_condition (ruled_out): filter proves the non-overlap; evidence=.skilled/commands/doctor/scripts/parent-skill-check.cjs:1152, .skilled/commands/doctor/scripts/parent-skill-check.cjs:1171
- iteration 5 evidence_gap (ruled_out): the pins exist; the residual message-wording gap is already R1-P2-002; evidence=.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:482-483, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:491-492, .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:499-500

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
