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
- Review Target: 027/021 hybrid-search scope-then-limit fix (files)
- Started: 2026-06-11T10:10:00Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-06-11T10:10:00Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 2 |
| P1 (Required) | 2 |
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 1/0/1 | complete |
| run-001 | security-fts | security-fts | 1.00 | 1/1/1 | complete |
| run-001 | test-perf-scope | test-perf-scope | 1.00 | 0/1/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
| security | pending | 0 |
| traceability | pending | 0 |
| maintainability | pending | 0 |

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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
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
- graphCoverageMode: none
- candidateCoverage: covered=0, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 correctness (ruled_out): SQL filter order is WHERE filters, then ORDER BY, then LIMIT.; evidence=lib/search/hybrid-search.ts:407
- iteration 1 correctness (ruled_out): No alternate return path in the in-memory branch slices before the metadata filter.; evidence=lib/search/hybrid-search.ts:480
- iteration 1 over-fetch (ruled_out): The remaining over-fetch risk is the metadata lookup batch size, reported separately.; evidence=lib/search/bm25-index.ts:655
- iteration 1 parity (ruled_out): Behavior parity is preserved for the no-db/no-scope path.; evidence=lib/search/hybrid-search.ts:427
- iteration 1 edge (ruled_out): These edge paths return empty or all available survivors as expected for positive limits.; evidence=lib/search/hybrid-search.ts:443
- iteration 2 scope (ruled_out): All observed scope-resolution failure paths return [] rather than unscoped candidates.; evidence=lib/search/hybrid-search.ts:444
- iteration 2 scope (ruled_out): The in-memory prefix semantics include a slash boundary.; evidence=lib/search/hybrid-search.ts:488
- iteration 2 fts (ruled_out): Filtering occurs in SQL before ranking limit is applied.; evidence=lib/search/sqlite-fts.ts:192
- iteration 3 scope (ruled_out): Reviewed scoped diff only touches the named implementation and test surfaces plus the phase docs folder.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:428
- iteration 3 doc-accuracy (ruled_out): No doc overclaim found in the reviewed files.; evidence=.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/implementation-summary.md:103
- iteration 3 hygiene (ruled_out): No banned ephemeral code-comment labels found in changed code.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:431

### Clean Search Proof
- iteration 1 correctness (ruled_out): SQL filter order is WHERE filters, then ORDER BY, then LIMIT.; evidence=lib/search/hybrid-search.ts:407
- iteration 1 correctness (ruled_out): No alternate return path in the in-memory branch slices before the metadata filter.; evidence=lib/search/hybrid-search.ts:480
- iteration 1 over-fetch (ruled_out): The remaining over-fetch risk is the metadata lookup batch size, reported separately.; evidence=lib/search/bm25-index.ts:655
- iteration 1 parity (ruled_out): Behavior parity is preserved for the no-db/no-scope path.; evidence=lib/search/hybrid-search.ts:427
- iteration 1 edge (ruled_out): These edge paths return empty or all available survivors as expected for positive limits.; evidence=lib/search/hybrid-search.ts:443
- iteration 2 scope (ruled_out): All observed scope-resolution failure paths return [] rather than unscoped candidates.; evidence=lib/search/hybrid-search.ts:444
- iteration 2 scope (ruled_out): The in-memory prefix semantics include a slash boundary.; evidence=lib/search/hybrid-search.ts:488
- iteration 2 fts (ruled_out): Filtering occurs in SQL before ranking limit is applied.; evidence=lib/search/sqlite-fts.ts:192
- iteration 3 scope (ruled_out): Reviewed scoped diff only touches the named implementation and test surfaces plus the phase docs folder.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:428
- iteration 3 doc-accuracy (ruled_out): No doc overclaim found in the reviewed files.; evidence=.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/012-hybrid-search-scope-then-limit/implementation-summary.md:103
- iteration 3 hygiene (ruled_out): No banned ephemeral code-comment labels found in changed code.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:431

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P0 finding(s) blocking release.
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
