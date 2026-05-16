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
- Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096 — architectural cross-phase audit) (track)
- Started: 2026-05-07T14:46:56Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: FAIL
- hasAdvisories: false
- Session ID: 2026-05-07T14:46:56Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 1 |
| P1 (Required) | 13 |
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-1 | inventory_correctness | correctness | 1.00 | 0/4/2 | complete |
| run-2 | correctness_deep_096 | correctness | 0.50 | 1/3/3 | complete |
| run-3 | security | security | 0.31 | 1/5/4 | complete |
| run-4 | traceability | traceability | 0.30 | 1/8/6 | complete |
| run-5 | maintainability | maintainability | 0.18 | 1/10/8 | complete |
| run-6 | adversarial_reverification_least_covered | correctness/security/traceability/maintainability | 0.07 | 1/10/9 | complete |
| run-7 | closure_saturation | correctness/security/traceability/maintainability | 0.07 | 1/11/9 | complete |
| run-8 | final_saturation | correctness/security/traceability/maintainability | 0.06 | 1/12/9 | complete |
| run-9 | python_support_tool_repass | correctness/security/traceability/maintainability | 0.00 | 1/12/9 | complete |
| run-10 | final_confirmation | correctness/security/traceability/maintainability | 0.00 | 1/12/9 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
| security | covered | 3 |
| traceability | covered | 5 |
| maintainability | covered | 4 |

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
- Last 3 ratios: 0.06 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 22
- persistentSameSeverity: 0
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 11. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
- 13 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
