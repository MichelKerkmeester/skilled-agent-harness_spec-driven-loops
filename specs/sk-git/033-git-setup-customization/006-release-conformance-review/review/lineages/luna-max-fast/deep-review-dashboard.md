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
- Review Target: specs/sk-git/033-git-setup-customization/006-release-conformance-review (spec-folder)
- Started: 2026-10-16T04:49:36Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-max-fast-1792125954096-ldhndm
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
| 1 | correctness and security: setup hook readiness and advisory registration diagnostics | correctness/security/traceability | 1.00 | 0/0/2 | complete |
| 2 | command surface: target binding, route parity, presentation prose, and documentation contracts | correctness/traceability/maintainability | 0.67 | 0/0/6 | complete |
| 3 | sk-git skill docs: package size, playbook references and plan, and documentation standards | correctness/maintainability/traceability | 0.54 | 0/1/12 | complete |
| 4 | cross-repo references, setup discoverability, and documentation conformance | correctness/maintainability/traceability | 0.28 | 0/1/17 | complete |
| 5 | release changelogs and final cross-target consistency | correctness/traceability/maintainability | 0.00 | 0/1/17 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 18 |
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
- Last 3 ratios: 0.54 -> 0.28 -> 0.00
- convergenceScore: 1.00
- openFindings: 18
- persistentSameSeverity: 18
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 18

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=21, ruledOut=12, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 5 changelog_structure (ruled_out): Both changelog validators returned VALID with zero issues.; evidence=.skilled/skills/sk-git/changelog/v1.9.0.0.md:1, .skilled/changelog/skilled/v4.0.0.11.md:1
- iteration 5 hvr_punctuation (ruled_out): Both HVR scans reported hardBlockers=0.; evidence=.skilled/skills/sk-git/changelog/v1.9.0.0.md:23, .skilled/changelog/skilled/v4.0.0.11.md:21
- iteration 5 doctor_target_discovery (ruled_out): No setup target naming drift was observed in the cross-target search.; evidence=README.md:1258, .skilled/commands/doctor/_routes.yaml:237, .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17
- iteration 5 setup_runtime_behavior (ruled_out): The final bounded runs both exited 0 with zero failed cases.; evidence=.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs, .github/scripts/tests/check-gate-inputs.test.sh

### Clean Search Proof
- iteration 5 changelog_structure (ruled_out): Both changelog validators returned VALID with zero issues.; evidence=.skilled/skills/sk-git/changelog/v1.9.0.0.md:1, .skilled/changelog/skilled/v4.0.0.11.md:1
- iteration 5 hvr_punctuation (ruled_out): Both HVR scans reported hardBlockers=0.; evidence=.skilled/skills/sk-git/changelog/v1.9.0.0.md:23, .skilled/changelog/skilled/v4.0.0.11.md:21
- iteration 5 doctor_target_discovery (ruled_out): No setup target naming drift was observed in the cross-target search.; evidence=README.md:1258, .skilled/commands/doctor/_routes.yaml:237, .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17
- iteration 5 setup_runtime_behavior (ruled_out): The final bounded runs both exited 0 with zero failed cases.; evidence=.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs, .github/scripts/tests/check-gate-inputs.test.sh

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Review the manifest's cross-repository command, skill, and setup references, including all repo listings that mention doctor commands or `/doctor:git` targets. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
