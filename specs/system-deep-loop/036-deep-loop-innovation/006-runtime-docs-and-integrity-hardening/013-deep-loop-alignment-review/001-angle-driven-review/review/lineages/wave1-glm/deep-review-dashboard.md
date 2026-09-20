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
- Review Target: specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review (spec-folder)
- Started: 2026-09-15T10:15:12Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-wave1-glm-1789465945073-px9i6h
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
| P2 (Suggestions) | 18 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Angle 6 — deep-loop command YAMLs: auto/confirm step parity, duplicated banners, containment-branch comments, confirm resource-map and flag handling, append-directive persistence mechanisms | traceability/correctness | 1.00 | 0/1/7 | complete |
| 2 | Angle 7 — agents and mirrors: 4-dialect declaration parity (.opencode/.claude/.codex/.pi), permission translation semantics, tool lexicons, delegation gates, model attraction | traceability/maintainability | 0.38 | 0/0/5 | complete |
| 3 | Angle 8 — cross-CLI executor parity: the 8-kind canon vs the runner builders, the adapter stress matrix, the seven cli-*/SKILL.md rosters, and the deep-loop protocol references — kinds, flags, limits, security posture | correctness/security | 0.19 | 0/0/3 | complete |
| 4 | Angle 9 — architecture/containment: the detect-quarantine-remedy-ledger-merge system, the containment promise chain across YAML comments, YAML code, and the runner's mode lifecycle, dead paths, and validator call-site multiplicity | correctness/maintainability | 0.11 | 0/0/2 | complete |
| 5 | Angle 10 — the state/ledger write path as one system: the append gateway's 4-branch acceptance, the authority/cutover binding, the registered 31-stem schemas, the legacy projections' replace semantics, the event producers on both sides of the stem/legacy divide, and this lane's own 9-row state log as the live specimen | security/correctness | 0.10 | 0/1/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 19 |
| security | covered | 1 |
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
- Last 3 ratios: 0.19 -> 0.11 -> 0.10
- convergenceScore: 0.90
- openFindings: 20
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
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None — iteration 5 of 5; the angle program (6-10) is complete and the max-iterations hard stop fires. The lane proceeds to synthesis: 20 active findings (P0 0, P1 2, P2 18), verdict CONDITIONAL, to be bound to the parent phase per REQ-003. The finding IDs are LINEAGE-SCOPED — the parent must namespace them by sessionId (`fanout-wave1-glm-1789465945073-px9i6h`) when merging with the twin lane (SC-001), whose F001-F0nn IDs WILL collide. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
