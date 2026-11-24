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
- Review Target: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder)
- Started: 2026-11-24T21:46:40Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-2-1795556727682-axtzf8
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
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 2 | correctness | correctness | 0.83 | 0/1/0 | complete |
| 3 | security | security | 0.46 | 0/1/0 | complete |
| 4 | maintainability | maintainability | 0.08 | 0/0/1 | complete |
| 5 | traceability | traceability | 0.08 | 0/0/1 | complete |
| 6 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 1 |
| traceability | covered | 3 |
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
- Last 3 ratios: 0.08 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 5
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
- candidateCoverage: covered=8, ruledOut=11, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 2 state_transition (ruled_out): Deliberate dedup order, read at the branch that implements it.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1226
- iteration 2 boundary (ruled_out): Read at both implementations.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1285, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5328
- iteration 2 boundary (ruled_out): Read at the routed and stuck branches.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1676
- iteration 3 trust_boundary (ruled_out): Read at the map that applies it.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:580
- iteration 3 injection (ruled_out): Read at the loop that walks typed commands.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:328
- iteration 4 guard_gap (ruled_out): Read every pre-slice pattern name against the slice text.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:694
- iteration 4 duplication (ruled_out): Read both helpers and their call patterns.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:810, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5248
- iteration 5 tick_without_evidence (ruled_out): Checked by the artefact each tick names.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:370, specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:222
- iteration 5 dangling_reference (ruled_out): Compared every section-3 path with the scope file.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:163
- iteration 6 stale_count (ruled_out): Projected every row.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1
- iteration 6 dangling_reference (ruled_out): Checked each line against the tree.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/review-scope-files.txt:1
- iteration 6 unbacked_waiver (ruled_out): Read each ADR heading against its cell.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 7 contract_drift (ruled_out): Read the skip on a fresh read.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1224
- iteration 7 trust_boundary (ruled_out): Read the only ownership assertion.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:96
- iteration 7 stale_count (ruled_out): Re-read every count cell filed against.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66

### Clean Search Proof
- iteration 2 state_transition (ruled_out): Deliberate dedup order, read at the branch that implements it.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1226
- iteration 2 boundary (ruled_out): Read at both implementations.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1285, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5328
- iteration 2 boundary (ruled_out): Read at the routed and stuck branches.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1676
- iteration 3 trust_boundary (ruled_out): Read at the map that applies it.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:580
- iteration 3 injection (ruled_out): Read at the loop that walks typed commands.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:328
- iteration 4 guard_gap (ruled_out): Read every pre-slice pattern name against the slice text.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:694
- iteration 4 duplication (ruled_out): Read both helpers and their call patterns.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:810, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5248
- iteration 5 tick_without_evidence (ruled_out): Checked by the artefact each tick names.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:370, specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:222
- iteration 5 dangling_reference (ruled_out): Compared every section-3 path with the scope file.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:163
- iteration 6 stale_count (ruled_out): Projected every row.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1
- iteration 6 dangling_reference (ruled_out): Checked each line against the tree.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/review-scope-files.txt:1
- iteration 6 unbacked_waiver (ruled_out): Read each ADR heading against its cell.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 7 contract_drift (ruled_out): Read the skip on a fresh read.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1224
- iteration 7 trust_boundary (ruled_out): Read the only ownership assertion.; evidence=.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:96
- iteration 7 stale_count (ruled_out): Re-read every count cell filed against.; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. The run reached its seventh and final iteration. The active set is two P1 and three P2 findings, so the run's verdict is `CONDITIONAL` and the next step is remediation, not another review angle.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
