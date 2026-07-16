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
- Review Target: 027/022 provenance injection (write-provenance.ts + write-path tagging) (files)
- Started: 2026-06-11T11:00:00Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-06-11T11:00:00Z
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
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | provenance-safety | provenance-safety | 1.00 | 3/1/0 | complete |
| run-001 | refactor-integrity | refactor-integrity | 1.00 | 0/1/1 | complete |
| run-001 | search-tests-scope | search-tests-scope | 1.00 | 0/2/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | pending | 9 |
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
- graphCoverageMode: none
- candidateCoverage: covered=0, ruledOut=7, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 schema-guarded (ruled_out): Column absence is checked before UPDATE statements, and PRAGMA errors are caught.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts:119
- iteration 1 human-path-preservation (ruled_out): No regression found for genuine human/manual writes deriving human.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts:70
- iteration 2 dropped-logic (ruled_out): Only provenance/source-kind persistence was centralized; core create-record behavior remains present.; evidence=handlers/save/create-record.ts:278
- iteration 2 guard (ruled_out): Guard logic remains intact and still skips protected automated field updates.; evidence=handlers/memory-crud-update.ts:94
- iteration 2 return-shape (ruled_out): No status or response-shape regression found for direct memory_save.; evidence=handlers/memory-save.ts:2303
- iteration 3 read-path (ruled_out): No ranking or membership mutation found in the changed search code.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:581
- iteration 3 test-integrity (ruled_out): No masked regression or deleted guard assertion found in the four modified tests.; evidence=.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:251

### Clean Search Proof
- iteration 1 schema-guarded (ruled_out): Column absence is checked before UPDATE statements, and PRAGMA errors are caught.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts:119
- iteration 1 human-path-preservation (ruled_out): No regression found for genuine human/manual writes deriving human.; evidence=.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts:70
- iteration 2 dropped-logic (ruled_out): Only provenance/source-kind persistence was centralized; core create-record behavior remains present.; evidence=handlers/save/create-record.ts:278
- iteration 2 guard (ruled_out): Guard logic remains intact and still skips protected automated field updates.; evidence=handlers/memory-crud-update.ts:94
- iteration 2 return-shape (ruled_out): No status or response-shape regression found for direct memory_save.; evidence=handlers/memory-save.ts:2303
- iteration 3 read-path (ruled_out): No ranking or membership mutation found in the changed search code.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:581
- iteration 3 test-integrity (ruled_out): No masked regression or deleted guard assertion found in the four modified tests.; evidence=.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:251

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
