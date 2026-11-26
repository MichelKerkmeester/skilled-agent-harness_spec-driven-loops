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
- Started: 2026-11-24T19:03:34Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-deepseek-max-2-1795546920757-7pyjry
- Parent Session: 2026-11-24T18:14:20.000Z
- Lifecycle Mode: new
- Generation: 7
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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.67 | 0/0/2 | complete |
| 4 | traceability | traceability | 0.25 | 0/0/1 | complete |
| 5 | security | security | 0.00 | 0/0/0 | complete |
| 6 | maintainability | maintainability | 0.20 | 0/0/1 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 0 |
| traceability | covered | 5 |
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
- Last 3 ratios: 0.00 -> 0.20 -> 0.00
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
- graphCoverageMode: graph
- candidateCoverage: covered=5, ruledOut=7, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read of every predicate the ask path calls; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1116
- iteration 1 contract_mismatch (ruled_out): no row differs from its recorded expectation; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1
- iteration 2 spec_mismatch (ruled_out): direct read of each cited surface; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80
- iteration 4 stale_evidence (ruled_out): direct read of each cited title; evidence=.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112
- iteration 5 policy_bypass (ruled_out): read both surfaces; evidence=.skilled/skills/system-deep-loop/command-metadata.json:9
- iteration 5 input_handling (ruled_out): read every dynamic pattern site; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748
- iteration 6 duplication_cost (ruled_out): read the guard and its pair count; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80
- iteration 7 spec_mismatch (ruled_out): every requirement names a live symbol, fixture row, test or ADR; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read of every predicate the ask path calls; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1116
- iteration 1 contract_mismatch (ruled_out): no row differs from its recorded expectation; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1
- iteration 2 spec_mismatch (ruled_out): direct read of each cited surface; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80
- iteration 4 stale_evidence (ruled_out): direct read of each cited title; evidence=.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112
- iteration 5 policy_bypass (ruled_out): read both surfaces; evidence=.skilled/skills/system-deep-loop/command-metadata.json:9
- iteration 5 input_handling (ruled_out): read every dynamic pattern site; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748
- iteration 6 duplication_cost (ruled_out): read the guard and its pair count; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80
- iteration 7 spec_mismatch (ruled_out): every requirement names a live symbol, fixture row, test or ADR; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None: the run reaches its iteration cap. Synthesis compiles the report from the registry and the iteration trail. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
