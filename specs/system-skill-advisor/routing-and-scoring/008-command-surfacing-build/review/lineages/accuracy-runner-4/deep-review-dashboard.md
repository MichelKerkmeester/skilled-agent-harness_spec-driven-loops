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
- Review Target: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (spec-folder)
- Started: 2026-11-14T15:20:00Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-accuracy-runner-4-1794669272137-9v23rz
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 7 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/2 | complete |
| 2 | security | security | 1.00 | 0/2/3 | complete |
| 3 | traceability | traceability | 1.00 | 0/2/5 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/2/7 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 2 |
| traceability | covered | 2 |
| maintainability | covered | 2 |

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
- openFindings: 9
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
- candidateCoverage: covered=15, ruledOut=6, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 codex_exec_string (ruled_out): documented fallback, no reaching input found; evidence=score-command-transcripts.mjs:340
- iteration 2 holdout_row_measurement (ruled_out): holdout_row returned before loadSession; evidence=score-command-transcripts.mjs:1232, score-command-transcripts.mjs:1506
- iteration 2 backfill_trust (ruled_out): trustedCheckout and no_checkout refusal verified; evidence=command-offer.mjs:354, command-offer.mjs:458
- iteration 3 documentation_drift (ruled_out): same root cause as iter1-P1-offeredas-not-persisted; evidence=README.md:123, command-offer.mjs:490
- iteration 3 documentation_drift (ruled_out): same six path counts; evidence=score-command-transcripts.mjs:1727
- iteration 4 active_finding_replay (ruled_out): re-read at cited lines and still active; evidence=command-offer.mjs:490, capture-command-routing-baseline.mjs:595
- iteration 4 coverage_gap (ruled_out): every scope file read at least once; evidence=review-scope-4.txt:18-25

### Clean Search Proof
- iteration 1 codex_exec_string (ruled_out): documented fallback, no reaching input found; evidence=score-command-transcripts.mjs:340
- iteration 2 holdout_row_measurement (ruled_out): holdout_row returned before loadSession; evidence=score-command-transcripts.mjs:1232, score-command-transcripts.mjs:1506
- iteration 2 backfill_trust (ruled_out): trustedCheckout and no_checkout refusal verified; evidence=command-offer.mjs:354, command-offer.mjs:458
- iteration 3 documentation_drift (ruled_out): same root cause as iter1-P1-offeredas-not-persisted; evidence=README.md:123, command-offer.mjs:490
- iteration 3 documentation_drift (ruled_out): same six path counts; evidence=score-command-transcripts.mjs:1727
- iteration 4 active_finding_replay (ruled_out): re-read at cited lines and still active; evidence=command-offer.mjs:490, capture-command-routing-baseline.mjs:595
- iteration 4 coverage_gap (ruled_out): every scope file read at least once; evidence=review-scope-4.txt:18-25

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (maintainability is the last configured dimension) - Focus area: terminal synthesis and the active-finding replay - Reason: the loop reaches `maxIterations=4` after this iteration; the next step is the synthesis report and the closeout event, not another dispatch. The two active P1s keep the verdict CONDITIONAL; the seven P2s are advisories. - Rotation status: all four dimensions covered; no new dimension remains - Required evidence: the findings registry, all four iteration files and deltas, and the reducer's final state - Recovery note: the run did not reach a legal graph-backed convergence; the stop reason is `maxIterationsReached`, and the report must say so. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
