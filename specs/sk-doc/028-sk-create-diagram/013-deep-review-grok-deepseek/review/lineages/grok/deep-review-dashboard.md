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
- Review Target: skill:sk-create-diagram (skill)
- Started: 2026-08-12T19:03:49Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-grok-1786561206858-teuyl2
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
| P1 (Required) | 4 |
| P2 (Suggestions) | 12 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/3 | complete |
| 2 | security | security | 0.25 | 0/0/4 | complete |
| 3 | traceability | traceability | 0.73 | 0/2/5 | complete |
| 4 | maintainability | maintainability | 0.06 | 0/2/6 | complete |
| 5 | stabilization-traceability-replay | traceability | 0.00 | 0/2/6 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 1 |
| traceability | covered | 11 |
| maintainability | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
### Iteration 4 — blocked by [dimensionCoverageGate]
- Recovery: Run one stabilization pass over active P1s F-T-001 and F-T-002; do not open a new dimension.
- Gate results: convergenceGate: false, dimensionCoverageGate: false, p0ResolutionGate: true, evidenceDensityGate: true, hotspotSaturationGate: true, claimAdjudicationGate: true, fixCompletenessReplayGate: true, candidateCoverageGate: true, graphlessFallbackGate: true
- Timestamp: 2026-08-12T19:08:26.096Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.96
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.73 -> 0.06 -> 0.00
- convergenceScore: 1.00
- openFindings: 16
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
- candidateCoverage: covered=4, ruledOut=2, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): explicit _reject_unsafe_xml guard; evidence=.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59
- iteration 2 injection (ruled_out): parsers treat labels as inert text; evidence=.opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py:7

### Clean Search Proof
- iteration 1 state_transition (ruled_out): explicit _reject_unsafe_xml guard; evidence=.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59
- iteration 2 injection (ruled_out): parsers treat labels as inert text; evidence=.opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py:7

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Latest blocked_stop at run 4: dimensionCoverageGate. Recovery: Run one stabilization pass over active P1s F-T-001 and F-T-002; do not open a new dimension..

<!-- /ANCHOR:active-risks -->
