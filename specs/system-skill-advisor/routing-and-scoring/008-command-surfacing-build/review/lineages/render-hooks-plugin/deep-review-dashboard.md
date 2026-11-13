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
- Started: 2026-11-13T06:12:00.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-render-hooks-plugin-1794550137809-1ecgc7
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
| P2 (Suggestions) | 11 |
| Resolved | 2 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/5 | complete |
| 2 | security | security | 1.00 | 0/1/2 | complete |
| 3 | traceability | traceability | 0.33 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 0.23 | 0/0/3 | complete |
| 5 | adjudication | correctness/security/traceability/maintainability | 0.15 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 3 |

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
- Last 3 ratios: 0.33 -> 0.23 -> 0.15
- convergenceScore: 0.85
- openFindings: 11
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
- candidateCoverage: covered=16, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 path_traversal (ruled_out): Guarded by resolveInside before readFileSync.; evidence=.skilled/hooks/shared/session-readers/claude.mjs:203
- iteration 1 state_transition (ruled_out): Cycle and missing-parent guards verified.; evidence=.skilled/hooks/shared/session-readers/devin.mjs:120
- iteration 2 holdout_leak (ruled_out): Search covered runtime/lib, skill-advisor-cli.ts, hooks, the plugin and .skilled/hooks/shared.; evidence=.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:94
- iteration 2 secret_exposure (ruled_out): No prompt text enters argv.; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:277
- iteration 3 doc_code_drift (ruled_out): README:42-43 specifies this exact ordering; R1-P2-001 resolved.; evidence=.skilled/hooks/shared/session-readers/README.md:42
- iteration 3 missing_consumer (ruled_out): subprocess.ts:103,119 verified.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:119
- iteration 4 dead_code (ruled_out): No duplicated brief renderer.; evidence=AGENTS.md:64
- iteration 5 severity_calibration (ruled_out): No demonstrable host dispatches an in-process child without the marker.; evidence=.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39
- iteration 5 finding_closure (ruled_out): README:42-43 specifies the exact precedence.; evidence=.skilled/hooks/shared/session-readers/README.md:42
- iteration 5 p0_p1_replay (ruled_out): Severity calibration holds at P2.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:239

### Clean Search Proof
- iteration 1 path_traversal (ruled_out): Guarded by resolveInside before readFileSync.; evidence=.skilled/hooks/shared/session-readers/claude.mjs:203
- iteration 1 state_transition (ruled_out): Cycle and missing-parent guards verified.; evidence=.skilled/hooks/shared/session-readers/devin.mjs:120
- iteration 2 holdout_leak (ruled_out): Search covered runtime/lib, skill-advisor-cli.ts, hooks, the plugin and .skilled/hooks/shared.; evidence=.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:94
- iteration 2 secret_exposure (ruled_out): No prompt text enters argv.; evidence=.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:277
- iteration 3 doc_code_drift (ruled_out): README:42-43 specifies this exact ordering; R1-P2-001 resolved.; evidence=.skilled/hooks/shared/session-readers/README.md:42
- iteration 3 missing_consumer (ruled_out): subprocess.ts:103,119 verified.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:119
- iteration 4 dead_code (ruled_out): No duplicated brief renderer.; evidence=AGENTS.md:64
- iteration 5 severity_calibration (ruled_out): No demonstrable host dispatches an in-process child without the marker.; evidence=.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39
- iteration 5 finding_closure (ruled_out): README:42-43 specifies the exact precedence.; evidence=.skilled/hooks/shared/session-readers/README.md:42
- iteration 5 p0_p1_replay (ruled_out): Severity calibration holds at P2.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:239

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis. - Reason: all four dimensions are covered, one dimension of adjudication is complete, and no active P0 or P1 remains. Further discovery would exceed `maxIterations = 5`. - Rotation status: complete. - Blocked/productive carry-forward: nothing blocked except the coverage gaps listed under Edge Cases. - Required evidence: the report's active registry must reproduce the eleven confirmed P2 entries and the two closures above. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 11 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
