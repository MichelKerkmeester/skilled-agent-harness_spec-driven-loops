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
- Started: 2026-11-13T06:12:20Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-accuracy-runner-1794550137809-1ecgc7
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
| P2 (Suggestions) | 9 |
| Resolved | 4 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/2 | complete |
| 2 | security | security | 1.00 | 0/1/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/2 | complete |
| 5 | stabilization | correctness/security/traceability/maintainability | 0.11 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 1 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 0.11
- convergenceScore: 0.89
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
- candidateCoverage: covered=10, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 restore_completeness (ruled_out): Pre-turn dirty guard and HEAD-based restore close the reachable paths.; evidence=worktree-restore.mjs:61-84, worktree-restore.mjs:97-122, run-command-behaviour.mjs:994-1000
- iteration 1 brief_detection (ruled_out): Pattern coverage verified against the full renderer head set and corpus command set.; evidence=render.ts:581-638, command-offer.mjs:36, command-offer.mjs:34
- iteration 2 path_traversal (ruled_out): Source of paths is git status output and every failure is surfaced as leftover/failure.; evidence=worktree-restore.mjs:97-122
- iteration 2 secrets_in_artifacts (ruled_out): Writes are confined to the checkout the arm measures and no prompt or env value is persisted.; evidence=command-offer.mjs:294-307, measure-brief-cost.mjs:99
- iteration 3 numeric_mismatch (ruled_out): Recomputed from the committed artifact; every floor met or exceeded.; evidence=command-routing-baseline.json
- iteration 3 stale_claim (ruled_out): Every triage symbol resolves in the current tree.; evidence=command-attach.ts:15, command-attach.ts:306, projection.ts:893-900
- iteration 4 stale_assertion (ruled_out): No skips or stale markers; each suite names a current behavior.; evidence=tests/legacy/advisor-corpus-parity.vitest.ts:101-110
- iteration 4 dead_code (ruled_out): Loud failure on a move; wait for a third consumer that shares further logic.; evidence=measure-brief-cost.mjs:37, score-command-transcripts.mjs:915
- iteration 5 orphan_fixture (ruled_out): Consumers exist and are declared in the independent-holdout gate.; evidence=tests/parity/holdout-independent.vitest.ts:80-82,168-199

### Clean Search Proof
- iteration 1 restore_completeness (ruled_out): Pre-turn dirty guard and HEAD-based restore close the reachable paths.; evidence=worktree-restore.mjs:61-84, worktree-restore.mjs:97-122, run-command-behaviour.mjs:994-1000
- iteration 1 brief_detection (ruled_out): Pattern coverage verified against the full renderer head set and corpus command set.; evidence=render.ts:581-638, command-offer.mjs:36, command-offer.mjs:34
- iteration 2 path_traversal (ruled_out): Source of paths is git status output and every failure is surfaced as leftover/failure.; evidence=worktree-restore.mjs:97-122
- iteration 2 secrets_in_artifacts (ruled_out): Writes are confined to the checkout the arm measures and no prompt or env value is persisted.; evidence=command-offer.mjs:294-307, measure-brief-cost.mjs:99
- iteration 3 numeric_mismatch (ruled_out): Recomputed from the committed artifact; every floor met or exceeded.; evidence=command-routing-baseline.json
- iteration 3 stale_claim (ruled_out): Every triage symbol resolves in the current tree.; evidence=command-attach.ts:15, command-attach.ts:306, projection.ts:893-900
- iteration 4 stale_assertion (ruled_out): No skips or stale markers; each suite names a current behavior.; evidence=tests/legacy/advisor-corpus-parity.vitest.ts:101-110
- iteration 4 dead_code (ruled_out): Loud failure on a move; wait for a third consumer that shares further logic.; evidence=measure-brief-cost.mjs:37, score-command-transcripts.mjs:915
- iteration 5 orphan_fixture (ruled_out): Consumers exist and are declared in the independent-holdout gate.; evidence=tests/parity/holdout-independent.vitest.ts:80-82,168-199

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none - Focus area: none; the loop stops at `maxIterations=5` without legal convergence. - Reason: `maxIterations` cap reached; synthesis follows. - Rotation status: D1-D4 complete plus stabilization pass. - Blocked/productive carry-forward: blocked (no live execution evidence for the cross-runtime proof); productive (holdout doctrine and severity re-adjudication). - Required evidence: none for iteration dispatch; synthesis reads the registry and iteration files. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 9 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
