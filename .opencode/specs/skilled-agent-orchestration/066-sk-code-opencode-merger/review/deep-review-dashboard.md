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
- Review Target: .opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger plus working tree changes for sk-code merger and public agent/command cleanup (spec-folder)
- Started: 2026-05-03T21:14:36Z
- Status: INITIALIZED
- Iteration: 7 of 7
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false
- Session ID: deep-review-066-20260503T211436Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 3 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | inventory + correctness | inventory/correctness | 1.00 | 0/1/1 | complete |
| 2 | security trust-boundary pass | security | 0.00 | 0/0/0 | complete |
| 3 | traceability pass | traceability | 1.00 | 0/1/0 | complete |
| 4 | maintainability pass | maintainability | 1.00 | 0/1/0 | complete |
| 5 | release-readiness replay / active finding validation | release-readiness replay/active finding validation | 0.00 | 0/0/0 | complete |
| 6 | cross-runtime public-surface parity replay | cross-runtime public-surface parity replay | 0.00 | 0/0/0 | complete |
| 7 | final adversarial checklist / synthesis preflight | final adversarial checklist/synthesis preflight | 0.00 | 0/3/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 1 |
| maintainability | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.89
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 4
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
- dimension: synthesis / remediation handoff - focus area: produce final review report and planning packet remediation order - reason: max iteration reached with no active P0, 3 active P1 blockers, and 1 active P2 advisory - rotation status: all configured dimensions and replay passes complete - blocked/productive carry-forward: do not add new review iterations unless target files change; carry F001/F003/F004 as required remediation and F002 as advisory - required evidence: remediation should update ADR/spec/plan/resource-map current-state metadata and workflow review `standards_contract.baseline` values, then rerun targeted validation/reducer refresh

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 11. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
