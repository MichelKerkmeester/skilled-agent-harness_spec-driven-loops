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
- Review Target: specs/system-speckit/053-ci-workflow-efficiency (spec-folder)
- Started: 2026-10-25T16:21:33Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-luna-1792944728998-0esx2f
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.00 | 0/0/1 | complete |
| 5 | cross-phase closure and acceptance integration | correctness/traceability | 0.00 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
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
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 3
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=5, ruledOut=5, deferred=1, blocked=0

### Search Debt
- iteration 2 live_privileged_path (deferred): The recorded Dependabot updates do not exercise the security-patch auto-merge branch; retain AC-002 as unmet until that proof is recorded.; evidence=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:653, specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:674, specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/acceptance-criteria.md:62

### Ruled-Out Candidates
- iteration 2 credential_value_exposure (ruled_out): No variable value reaches the returned report object or table.; evidence=.skilled/commands/doctor/scripts/ci-report.cjs:147, .skilled/commands/doctor/scripts/ci-report.cjs:373
- iteration 2 shell_argument_injection (ruled_out): No command-shell interpolation path was found in this call flow.; evidence=.skilled/commands/doctor/scripts/ci-report.cjs:85, .skilled/commands/doctor/scripts/ci-report.cjs:119, .skilled/commands/doctor/scripts/ci-report.cjs:202
- iteration 2 required_check_disable_bypass (ruled_out): The reviewed toggle path contains explicit guardrails for the only required check.; evidence=.skilled/commands/doctor/assets/doctor-ci-toggle.yaml:27, .skilled/commands/doctor/assets/doctor-ci-toggle.yaml:71, .github/workflows/README.md:95
- iteration 2 privileged_job_isolation (ruled_out): No repository code or third-party action runs in the write-scoped job.; evidence=.github/workflows/dependabot-auto-merge.yml:19, .github/workflows/dependabot-auto-merge.yml:29, .github/workflows/dependabot-auto-merge.yml:38, .github/workflows/dependabot-auto-merge.yml:58
- iteration 4 supersession_marker_drift (ruled_out): ADR-013 references make active versus historical scope explicit.; evidence=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/spec.md:164, specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md:160

### Clean Search Proof
- iteration 2 credential_value_exposure (ruled_out): No variable value reaches the returned report object or table.; evidence=.skilled/commands/doctor/scripts/ci-report.cjs:147, .skilled/commands/doctor/scripts/ci-report.cjs:373
- iteration 2 shell_argument_injection (ruled_out): No command-shell interpolation path was found in this call flow.; evidence=.skilled/commands/doctor/scripts/ci-report.cjs:85, .skilled/commands/doctor/scripts/ci-report.cjs:119, .skilled/commands/doctor/scripts/ci-report.cjs:202
- iteration 2 required_check_disable_bypass (ruled_out): The reviewed toggle path contains explicit guardrails for the only required check.; evidence=.skilled/commands/doctor/assets/doctor-ci-toggle.yaml:27, .skilled/commands/doctor/assets/doctor-ci-toggle.yaml:71, .github/workflows/README.md:95
- iteration 2 privileged_job_isolation (ruled_out): No repository code or third-party action runs in the write-scoped job.; evidence=.github/workflows/dependabot-auto-merge.yml:19, .github/workflows/dependabot-auto-merge.yml:29, .github/workflows/dependabot-auto-merge.yml:38, .github/workflows/dependabot-auto-merge.yml:58
- iteration 4 supersession_marker_drift (ruled_out): ADR-013 references make active versus historical scope explicit.; evidence=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/spec.md:164, specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md:160

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
