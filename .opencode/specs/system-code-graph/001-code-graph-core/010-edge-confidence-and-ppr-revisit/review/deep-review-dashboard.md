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
- Review Target: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit (spec-folder)
- Started: 2026-07-01T13:37:25.000Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-07-01T13:37:25.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 8 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory + correctness: confidence differentiation gating and seeded-PPR wiring | correctness | 1.00 | 0/1/0 | complete |
| run-001 | inventory + correctness: confidence differentiation gating and seeded-PPR wiring | correctness | 1.00 | 0/1/0 | complete |
| run-002 | correctness finer grain: seeded-PPR deadline duplicate trace behavior; initial checklist evidence replay | correctness/traceability | 1.00 | 0/2/0 | complete |
| run-003 | security/reliability: eval harness filesystem cleanup, env handling, and edge-confidence write paths | security/reliability | 0.25 | 0/0/1 | complete |
| run-004 | maintainability + traceability overlays: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability | traceability/maintainability | 0.25 | 0/0/1 | complete |
| run-005 | correctness deeper on test coverage for seeded-PPR, includeTrace, flag-off behavior, and edge cases | correctness | 0.17 | 0/0/1 | complete |
| run-006 | correctness/integration: runtime handler surfaces for P1-001 and P1-002 reachability | correctness/traceability/maintainability | 0.00 | 0/0/0 | complete |
| run-007 | correctness/integration: daemon launcher startup, build-order guarantees, and crash-loop surfacing | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |
| run-008 | Full line-by-line correctness audit of resolveCrossFileCallEdges confidence-differentiation write path | correctness | 0.14 | 0/1/0 | complete |
| run-009 | correctness audit: structural-indexer same-file CALLS edge confidence differentiation helper and gated call site | correctness | 0.00 | 0/0/0 | complete |
| run-010 | Traceability: internal doc-to-doc consistency across packet docs | traceability | 0.33 | 0/1/2 | complete |
| run-011 | traceability + correctness on ENV_REFERENCE edge-confidence flag docs and seeded-PPR stale-doc drift | traceability | 0.20 | 0/0/1 | complete |
| run-012 | Security deep-dive on edge-confidence env parsing, confidence metadata writes, SQL parameterization, and seeded-PPR prototype-pollution exposure | security | 0.00 | 0/0/0 | complete |
| run-014 | Independent re-verification of seeded-PPR re-benchmark evidence | traceability | 1.00 | 0/1/0 | complete |
| run-015 | Independent git-history re-verification for seeded-PPR recovery claims | traceability | 0.00 | 0/0/0 | complete |
| run-016 | ADR-001 compliance deep audit for orphaned local weighted-walk implementation traces | maintainability | 0.00 | 0/0/0 | complete |
| run-013 | Independent re-verification of packet verification claims | correctness | 1.00 | 0/1/0 | complete |
| run-017 | Concurrency/idempotency correctness of the code-graph-context top-level Memory MCP weighted-walk import and PPR module state | correctness | 0.00 | 0/0/0 | complete |
| run-018 | Confidence-value internal consistency audit for edge metadata consumers | correctness | 0.14 | 0/1/0 | complete |
| run-019 | Rollback and flag-toggle correctness for code graph edge-confidence differentiation and seeded-PPR ranking | correctness | 0.50 | 0/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 14 |
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
- Last 3 ratios: 0.00 -> 0.14 -> 0.50
- convergenceScore: 0.50
- openFindings: 14
- persistentSameSeverity: 1
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 1

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
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 8 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
