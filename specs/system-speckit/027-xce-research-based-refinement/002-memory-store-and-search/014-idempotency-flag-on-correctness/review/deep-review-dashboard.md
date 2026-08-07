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
- Review Target: 027/023 idempotency flag-ON correctness (files)
- Started: 2026-06-11T12:10:00Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-06-11T12:10:00Z
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | idempotency-correctness | idempotency-correctness | 1.00 | 1/0/0 | complete |
| run-001 | flagoff-scope-hygiene | flagoff-scope-hygiene | 1.00 | 0/0/0 | complete |
| run-001 | adversarial-tests | adversarial-tests | 1.00 | 1/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | pending | 3 |
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
- openFindings: 3
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
- candidateCoverage: covered=0, ruledOut=7, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 replay (ruled_out): No replay metadata leak or shape mutation found in the replay path.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:133
- iteration 1 first-write (ruled_out): Schema supports first-write immutability.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:658
- iteration 1 guard (ruled_out): No over-broad receipt storage found for non-mutating or failed save results.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:104
- iteration 1 conflict (ruled_out): Sequential conflict semantics are correct; the remaining issue is only the concurrent pre-receipt race above.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:87
- iteration 3 retry (ruled_out): No reviewed failed/aborted path stores a receipt before completion.; evidence=handlers/memory-save.ts:3531
- iteration 3 normalization (ruled_out): No normalization defect found in the covered cases.; evidence=lib/storage/idempotency-receipts.ts:59
- iteration 3 near-duplicate (ruled_out): No double-handling or idempotency/near-duplicate conflict found.; evidence=handlers/memory-save.ts:2713

### Clean Search Proof
- iteration 1 replay (ruled_out): No replay metadata leak or shape mutation found in the replay path.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:133
- iteration 1 first-write (ruled_out): Schema supports first-write immutability.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:658
- iteration 1 guard (ruled_out): No over-broad receipt storage found for non-mutating or failed save results.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:104
- iteration 1 conflict (ruled_out): Sequential conflict semantics are correct; the remaining issue is only the concurrent pre-receipt race above.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:87
- iteration 3 retry (ruled_out): No reviewed failed/aborted path stores a receipt before completion.; evidence=handlers/memory-save.ts:3531
- iteration 3 normalization (ruled_out): No normalization defect found in the covered cases.; evidence=lib/storage/idempotency-receipts.ts:59
- iteration 3 near-duplicate (ruled_out): No double-handling or idempotency/near-duplicate conflict found.; evidence=handlers/memory-save.ts:2713

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
correctness

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P0 finding(s) blocking release.
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
