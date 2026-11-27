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
- Review Target: Review the finished reference evidence research in specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/: the synthesis research.md, its regrade-log.md and the 40 iteration records under research/lineages/. Check that each recommendation is backed by the reference and plan lines it cites, that grades are right, that rejected findings were rightly rejected, that no well-supported finding was missed, and that recommendations do not contradict each other, the packet decisions or the licence rules. Read-only against the research, the 003 build plan and the reference repos. (files)
- Started: 2026-11-27T09:15:43.061Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-11-27T09:14:53.505Z
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 17 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | traceability | traceability | 1.00 | 0/1/1 | complete |
| 3 | correctness | correctness | 0.50 | 0/0/2 | complete |
| 4 | security | security | 1.00 | 0/0/2 | complete |
| 5 | maintainability | maintainability | 0.83 | 0/0/3 | complete |
| 6 | traceability | traceability | 0.83 | 0/0/3 | complete |
| 7 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 8 | security: licence obligations and the licence map | security | 1.00 | 0/0/0 | complete |
| 9 | maintainability: section 14 references and the reading guide | maintainability | 1.00 | 0/0/0 | complete |
| 10 | cross-reference synthesis: whether the recommendations hold together | traceability | 1.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 16 |
| security | covered | 0 |
| traceability | covered | 2 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 18
- persistentSameSeverity: 3
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 3

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
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none — the iteration budget is spent.
- Focus area: the synthesis phase, which reads the 17 open findings and the ten iteration records and writes the review report.
- Reason: `config.maxIterations` is 10 and this is iteration 10. The run did not converge: the last four iterations each produced two new P2s, and the novelty ratio stayed at 1.0 because every finding was new to the run.
- Rotation status: correctness three times (iterations 1, 3, 7), traceability twice (iterations 2, 6), security twice (iterations 4, 8), maintainability twice (iterations 5, 9), cross-reference synthesis once (iteration 10).
- Blocked/productive carry-forward: nothing blocked. Productive: reading a summary's selection rule against the list beside it, which is what showed the guards list states its rule and the lift list does not.
- Required evidence: the ten iteration records, the findings registry and the strategy file, all inside the lineage directory.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
