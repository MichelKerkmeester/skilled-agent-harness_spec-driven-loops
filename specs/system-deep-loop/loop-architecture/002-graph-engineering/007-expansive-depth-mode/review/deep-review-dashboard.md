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
- Review Target: commit range 21c4b325b5a..f30fcdb42f6 (expansive-depth program logic: code, command YAML assets and tests under .skilled/skills/system-deep-loop/ and .skilled/commands/deep/; docs, playbooks and specs excluded) (files)
- Started: 2026-11-19T15:38:08.666Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-19T15:38:08.666Z
- Parent Session: 2026-11-19T04:20:12.962Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none
- stopReason: maxIterationsReached

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
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/0 | complete |
| 2 | security | security | 0.17 | 0/0/1 | complete |
| 3 | maintainability | maintainability | 0.14 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 1 |
| traceability | pending | 0 |
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
- Last 3 ratios: 1.00 -> 0.17 -> 0.14
- convergenceScore: 0.86
- openFindings: 3
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
- candidateCoverage: covered=3, ruledOut=12, deferred=2, blocked=0

### Search Debt
- iteration 1 unreviewed_scope (deferred): carried to iteration 2 under the security lens; evidence=UNKNOWN
- iteration 3 test_coverage (deferred): about 38 test files and 10k added lines exceed the 24-call budget; synthesis should treat this as unreviewed; evidence=.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:400

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:577, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:805
- iteration 1 stop_condition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1169
- iteration 1 merge_integrity (ruled_out): depth-1 ids are unique by construction; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
- iteration 2 shell_injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:672, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:766, .skilled/commands/deep/assets/deep-review.yaml:1193, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2062
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:467, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:472
- iteration 2 prompt_structure_injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:136, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:588, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:880
- iteration 2 regex_injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1
- iteration 2 shell_injection (ruled_out): verified by direct read; evidence=.skilled/commands/deep/assets/deep-research.yaml:1661
- iteration 2 signal_forgery (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:1
- iteration 2 env_leak (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:362, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:813
- iteration 3 overengineering (ruled_out): 6 and 5 node -e steps existed at 21c4b325b5a; workflow-restart-lifecycle runs both; evidence=.skilled/commands/deep/assets/deep-review.yaml:513, .skilled/commands/deep/assets/deep-research.yaml:485, .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:721
- iteration 3 overengineering (ruled_out): tests pin FIND-, finding- and lowercase spellings; evidence=.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:400, .skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:530, .skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:567
- iteration 3 comment_hygiene (ruled_out): the only hits describe the finding-id grammar, a durable format; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:170
- iteration 3 state_transition (ruled_out): status answered is set in the node map before applyReviewFrontierBudget runs; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2026, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2041
- iteration 3 duplicated_logic (ruled_out): each mode owns its schema; the YAML derivation matches both validators; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:951, .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:1087

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:577, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:805
- iteration 1 stop_condition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1169
- iteration 1 merge_integrity (ruled_out): depth-1 ids are unique by construction; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
- iteration 2 shell_injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:672, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:766, .skilled/commands/deep/assets/deep-review.yaml:1193, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2062
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:467, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:472
- iteration 2 prompt_structure_injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:136, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:588, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:880
- iteration 2 regex_injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1
- iteration 2 shell_injection (ruled_out): verified by direct read; evidence=.skilled/commands/deep/assets/deep-research.yaml:1661
- iteration 2 signal_forgery (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:1
- iteration 2 env_leak (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:362, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:813
- iteration 3 overengineering (ruled_out): 6 and 5 node -e steps existed at 21c4b325b5a; workflow-restart-lifecycle runs both; evidence=.skilled/commands/deep/assets/deep-review.yaml:513, .skilled/commands/deep/assets/deep-research.yaml:485, .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:721
- iteration 3 overengineering (ruled_out): tests pin FIND-, finding- and lowercase spellings; evidence=.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:400, .skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:530, .skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts:567
- iteration 3 comment_hygiene (ruled_out): the only hits describe the finding-id grammar, a durable format; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:170
- iteration 3 state_transition (ruled_out): status answered is set in the node map before applyReviewFrontierBudget runs; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2026, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2041
- iteration 3 duplicated_logic (ruled_out): each mode owns its schema; the YAML derivation matches both validators; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:951, .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:1087

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
traceability

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
