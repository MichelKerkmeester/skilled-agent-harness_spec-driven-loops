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
- Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096, 098-097-remediation — verdict-flip confirmation) (track)
- Started: 2026-05-07T17:08:57Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false
- Session ID: 2026-05-07T17:08:57Z
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
| P0 (Blockers) | 0 |
| P1 (Required) | 13 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory | inventory | 0.00 | 0/1/4 | complete |
| run-002 | correctness | correctness | 0.29 | 0/3/4 | complete |
| run-003 | correctness | correctness | 0.22 | 0/5/4 | complete |
| run-004 | security | security | 0.10 | 0/6/4 | complete |
| run-005 | traceability - smart-router validator, advisor state path, sk-deep dead refs, runtime mirror parity | traceability | 0.17 | 0/8/4 | complete |
| run-006 | traceability - resource-map target_files cross-check, memory_handback references, install-guide drift, playbook reachability | traceability | 0.08 | 0/8/5 | complete |
| run-007 | maintainability - doc anchors, narrative repair quality, sed casualties, deferred-item continuity, RCAF templates, cross-CLI consistency | maintainability | 0.19 | 0/10/6 | complete |
| run-008 | cross-cutting validate.sh sweep + active P1 re-verification + opencode discovery sanity + hook gates | correctness/security/traceability/maintainability | 0.16 | 0/13/6 | complete |
| run-009 | adversarial-pass | correctness/security/traceability/maintainability | 0.00 | 0/13/6 | complete |
| run-010 | saturation-final | correctness/security/traceability/maintainability | 0.00 | 0/13/6 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 19 |
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
- Last 3 ratios: 0.16 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 19
- persistentSameSeverity: 12
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 12

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
- 13 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
