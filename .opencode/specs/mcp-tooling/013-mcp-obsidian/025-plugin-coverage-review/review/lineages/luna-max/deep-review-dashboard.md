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
- Review Target: .opencode/specs/mcp-tooling/013-mcp-obsidian/025-plugin-coverage-review (spec-folder)
- Started: 2026-08-05T09:42:23.477Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-max-1785922353061-yt4m7p
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
| P1 (Required) | 5 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | plugin inventory, specific and generic router correctness, and target review inputs | correctness | 1.00 | 0/2/1 | complete |
| 2 | security, token handling, untrusted release metadata, path construction, and read-to-write error boundaries | security | 0.50 | 0/5/1 | complete |
| 3 | traceability reconstruction across router, references, cards, assets, playbook, and target report | traceability | 0.00 | 0/5/1 | complete |
| 4 | maintainability, explicit verification boundaries, metadata freshness, and uncertainty communication | maintainability | 0.14 | 0/5/2 | complete |
| 5 | independent correctness replay of route matrix and required-file inventory | correctness | 0.00 | 0/5/2 | complete |
| 6 | adversarial security replay for token transport, path construction, and read-error classification | security | 0.00 | 0/5/2 | complete |
| 7 | traceability replay for finding evidence, source paths, inventories, and normative target inputs | traceability | 0.00 | 0/5/2 | complete |
| 8 | maintainability replay for version-sensitive data models, metadata freshness, and executable syntax | maintainability | 0.00 | 0/5/2 | complete |
| 9 | adversarial final correctness and security replay for routing, token transport, path construction, and read-before-write handling | correctness/security | 0.00 | 0/5/2 | complete |
| 10 | final all-dimensions stabilization at maxIterationsReached | correctness/security/traceability/maintainability | 0.00 | 0/5/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 4 |
| traceability | covered | 0 |
| maintainability | covered | 1 |

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
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
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
Forced final stabilization pass across all review dimensions; stop only after iteration 10 under the max-iterations policy. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
