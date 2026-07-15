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
- Review Target: 027/020 vector-resilience durability (commit 1ee9e1e767): repair-pending sentinel at quarantine, boot resume in attachActiveVectorShard, clear stuck-degraded on non-repair reindex (files)
- Started: 2026-06-11T09:10:00Z
- Status: IN-PROGRESS
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-06-11T09:10:00Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 3 |
| P1 (Required) | 4 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | sentinel-durability | sentinel-durability | 1.00 | 1/0/0 | complete |
| run-001 | boot-resume | boot-resume | 1.00 | 1/1/0 | complete |
| run-001 | clear-degraded | clear-degraded | 1.00 | 1/0/0 | complete |
| run-001 | behavior-preservation | behavior-preservation | 1.00 | 0/1/0 | complete |
| run-001 | test-rigor | test-rigor | 1.00 | 0/2/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | pending | 7 |
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
- iteration 1 ordering (ruled_out): The write-then-act order is explicit and synchronous.; evidence=lib/search/vector-index-store.ts:590
- iteration 1 atomicity (ruled_out): Pattern is materially identical to write_needs_rebuild_sentinel_for_corruption.; evidence=lib/search/vector-index-store.ts:1032
- iteration 1 path (ruled_out): No path traversal or cross-shard collision evidence in the reviewed commit.; evidence=lib/search/vector-index-store.ts:1006
- iteration 2 boot (ruled_out): The code never uses sentinel.quarantinePath as the attach target.; evidence=lib/search/vector-index-store.ts:1414
- iteration 2 degraded-key (ruled_out): No degraded-key mismatch found for the normal single active shard/profile path.; evidence=lib/observability/retrieval-observability.ts:250
- iteration 5 live-shard-safety (ruled_out): All destructive shard operations are derived from activeProfile.getVectorShardPath(tempDir) or dbPath under tempDir, and host socket path is sandboxed before handler use.; evidence=tests/vector-shard-read-path-resilience.vitest.ts:125
- iteration 5 test-rigor (ruled_out): It is still in-process rather than a module/process reload, but the test does not rely on an in-memory repair flag because it fabricates only the on-disk sentinel and resets observability before the new attach.; evidence=tests/vector-shard-read-path-resilience.vitest.ts:237
- iteration 5 hygiene (ruled_out): Commit diff for the reviewed files shows no newly added banned labels in code comments.; evidence=lib/search/vector-index-store.ts:1006

### Clean Search Proof
- iteration 1 ordering (ruled_out): The write-then-act order is explicit and synchronous.; evidence=lib/search/vector-index-store.ts:590
- iteration 1 atomicity (ruled_out): Pattern is materially identical to write_needs_rebuild_sentinel_for_corruption.; evidence=lib/search/vector-index-store.ts:1032
- iteration 1 path (ruled_out): No path traversal or cross-shard collision evidence in the reviewed commit.; evidence=lib/search/vector-index-store.ts:1006
- iteration 2 boot (ruled_out): The code never uses sentinel.quarantinePath as the attach target.; evidence=lib/search/vector-index-store.ts:1414
- iteration 2 degraded-key (ruled_out): No degraded-key mismatch found for the normal single active shard/profile path.; evidence=lib/observability/retrieval-observability.ts:250
- iteration 5 live-shard-safety (ruled_out): All destructive shard operations are derived from activeProfile.getVectorShardPath(tempDir) or dbPath under tempDir, and host socket path is sandboxed before handler use.; evidence=tests/vector-shard-read-path-resilience.vitest.ts:125
- iteration 5 test-rigor (ruled_out): It is still in-process rather than a module/process reload, but the test does not rely on an in-memory repair flag because it fabricates only the on-disk sentinel and resets observability before the new attach.; evidence=tests/vector-shard-read-path-resilience.vitest.ts:237
- iteration 5 hygiene (ruled_out): Commit diff for the reviewed files shows no newly added banned labels in code comments.; evidence=lib/search/vector-index-store.ts:1006

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
correctness

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P0 finding(s) blocking release.
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
