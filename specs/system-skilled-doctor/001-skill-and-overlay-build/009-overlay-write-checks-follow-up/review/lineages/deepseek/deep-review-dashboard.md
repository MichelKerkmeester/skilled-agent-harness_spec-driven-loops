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
- Review Target: commits c57b7e4cef..e97ca56e8d on main: .skilled/commands/doctor/scripts/overlay-engine.cjs, its tests under .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs, .skilled/hooks/overlay-guard/opencode/, .skilled/commands/doctor/overlay.md with _routes.yaml and assets/doctor-overlay-*, .skilled/skills/system-skilled-doctor/references/overlays.md and its manual-testing-playbook/overlays/ (files)
- Started: 2026-11-11T23:24:47.291Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-1794439428470-vyb51k
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: data-loss and safety paths (lock takeover, layout link retarget, dropped json-entry removal, apply --relayout moves and backups) | correctness | 1.00 | 0/2/0 | complete |
| 2 | security: strict write checks, commit check, status --audit, OpenCode adapter, and the protectedPaths credential rule | security | 0.38 | 0/1/1 | complete |
| 3 | traceability of the command documents against the engine, plus the maintainability tail | traceability/maintainability | 0.16 | 0/0/3 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
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
- Last 3 ratios: 1.00 -> 0.38 -> 0.16
- convergenceScore: 0.84
- openFindings: 7
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
- Dimension: none remaining — traceability and maintainability closed at this iteration - Focus area: synthesis - Reason: `maxIterations` is 3 and the loop stops on the cap; the three active P1 findings and four active P2 findings are the input to the report - Rotation status: all four dimensions have been reviewed (D1, D2 CONDITIONAL; D3, D4 CONDITIONAL with P2 advisories only) - Blocked/productive carry-forward: productive — the doc-sentence-versus-code-line pairing produced one P1 and one P2 in this iteration; nothing is blocked - Required evidence: none further; synthesis reads the registry - Recovery note: not applicable Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
