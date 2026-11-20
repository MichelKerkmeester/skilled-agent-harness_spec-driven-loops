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
- Review Target: 21c4b325b5a..de32abbb74d -- .skilled/skills/system-deep-loop .skilled/commands/deep .skilled/agents .claude/agents .codex/agents .pi/agents .dsh/agents .vibe/agents (the expansive-depth program: runtime code and tests, command YAML and presentation, agents and their runtime mirrors, skill docs, playbooks and catalogs; specs/ evidence and spec-packet artifacts excluded) (files)
- Started: 2026-11-19T18:41:16.000Z
- Status: COMPLETE
- Iteration: 12 of 24
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-1795113418367-pvzn7z
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | F-1-003 correctness: fan-out frontier partition, lineage prompt and merged coverage | correctness | 1.00 | 0/0/4 | complete |
| 2 | F-1-005 correctness: reducers, convergence, verification and the ledger/projection layer | correctness | 0.58 | 0/1/1 | complete |
| 3 | F-1-007 correctness: divergent pivot, continuity thread and coverage-graph signals | correctness | 0.36 | 0/1/0 | complete |
| 4 | F-1-003 security: fan-out runner command construction, env and merge trust boundaries | security | 0.00 | 0/0/0 | complete |
| 5 | F-1-005 security: reducer, gateway-facing state, upsert and dispatch trust boundaries | security | 0.07 | 0/0/1 | complete |
| 6 | F-1-007 security: pivot persisted input, council paths and frontier graph projection | security | 0.00 | 0/0/0 | complete |
| 7 | F-1-003 traceability: fan-out runner and merge against the review packet | traceability | 0.00 | 0/0/0 | complete |
| 8 | F-1-005 traceability: extension, state-log fields and evidence edges against the packet | traceability | 0.00 | 0/0/0 | complete |
| 9 | F-1-007 traceability: pivot retry, continuity and quality class against the packet | traceability | 0.00 | 0/0/0 | complete |
| 10 | F-1-003 maintainability: fan-out runner and merge change cost | maintainability | 0.00 | 0/0/0 | complete |
| 11 | F-1-005 maintainability: reducer and upsert change cost | maintainability | 0.00 | 0/0/0 | complete |
| 12 | F-1-007 maintainability: pivot and coverage-graph change cost | maintainability | 0.05 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 1 |
| traceability | covered | 0 |
| maintainability | covered | 1 |

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
- Last 3 ratios: 0.00 -> 0.00 -> 0.05
- convergenceScore: 0.95
- openFindings: 8
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
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 3 nodes (0 open, 0 active, 3 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 12 of 12 iterations spent
- Budget depth2: 0 of 8.4 iterations spent
- Budget depth3: 0 of 12 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All three dealt nodes cover correctness, security, traceability and maintainability; the frontier is answered and the run proceeds to synthesis with stop reason `converged` / reasonDetail `frontier_drained`. - Reason: the dealt frontier holds no open or active node and at least one answered node, which is the legal `frontier_drained` candidate once the stop gates pass. - Required evidence: the findings registry, the merged state log and the iteration files this synthesis reads. - Rotation status: complete. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
