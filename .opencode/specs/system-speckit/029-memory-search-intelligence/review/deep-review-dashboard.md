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
- Review Target: .opencode/specs/system-speckit/029-memory-search-intelligence (spec-folder)
- Started: 2026-07-10T15:34:57.000Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: deep-review-20260710T153457Z
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
| P1 (Required) | 11 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | traceability: packet-root navigation and seeds S1-S4 | traceability | 1.00 | 0/3/1 | complete |
| run-002 | maintainability: children 006-008 template conformance, Phase R evidence quality, status coherence | maintainability | 0.43 | 0/2/1 | complete |
| run-005 | traceability: handlers README claims against merged handler implementations | traceability | 0.00 | 0/0/0 | complete |
| run-008 | maintainability: system-spec-kit skill-doc alignment for drift-marker and generated-metadata pruning surfaces | maintainability | 0.00 | 0/0/0 | complete |
| run-009 | traceability: comment hygiene and 017-023 reconciliation-merge documentation drift | traceability | 0.17 | 0/0/1 | complete |
| run-010 | final traceability and maintainability re-verification sweep | correctness/security/traceability/maintainability | 0.00 | 0/5/3 | complete |
| run-003 | traceability: Phase R evidence and status coherence for children 009-012 | traceability | 0.25 | 0/2/0 | complete |
| run-004 | maintainability: children 013-016 template conformance, evidence quality, and status coherence | maintainability | 1.00 | 0/3/2 | complete |
| run-006 | traceability: search and storage README contracts | traceability | 0.00 | 0/0/0 | complete |
| run-007 | traceability: ENV_REFERENCE.md flag defaults and runtime reads | traceability | 0.20 | 0/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 16 |
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
- Last 3 ratios: 1.00 -> 0.00 -> 0.20
- convergenceScore: 0.80
- openFindings: 16
- persistentSameSeverity: 8
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 8

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=23, ruledOut=16, deferred=1, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 5 index_maintenance_scope (ruled_out): Direct implementation evidence supports the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/README.md:120, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:660-697,993-1080,1775-1789
- iteration 5 search_retrieval_contract (ruled_out): Direct implementation evidence supports the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/README.md:113, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:421-470,1642-1695,1841-1853
- iteration 5 save_concurrency_boundary (ruled_out): Exact usage and implementation evidence support the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:287-337, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2888
- iteration 5 context_mode_routing (ruled_out): Direct implementation evidence supports the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1184-1369,1724-1822
- iteration 5 documentation_claim_drift (ruled_out): Claim-to-code review completed without contradiction.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/README.md:15-24,109-131, .opencode/skills/system-spec-kit/mcp_server/handlers/index.ts:275,387
- iteration 8 documentation_claim_drift (ruled_out): Direct-read comparison found no unsupported or conflicting contract.; evidence=.opencode/skills/system-spec-kit/SKILL.md:95-117, .opencode/skills/system-spec-kit/scripts/README.md:103-119
- iteration 8 prune_safety_contract (ruled_out): All required safeguards are explicitly documented.; evidence=.opencode/skills/system-spec-kit/scripts/README.md:188-205
- iteration 8 cross_skill_reference_drift (ruled_out): No stale local resolver or conflicting owner claim was found.; evidence=.opencode/skills/system-deep-loop/deep-review/SKILL.md:62,414,424
- iteration 9 comment_hygiene (ruled_out): The inventory and directly reviewed documentation did not expose a comment-hygiene violation.; evidence=git diff --name-only 5afd2f6522..HEAD
- iteration 9 documentation_drift (ruled_out): Direct read found evidence-bearing claims without a documented contradiction.; evidence=.opencode/specs/system-speckit/029-memory-search-intelligence/019-validation-enforce-graduation/implementation-summary.md:71-75,158-185, .opencode/specs/system-speckit/029-memory-search-intelligence/023-self-healing-model-consolidation/implementation-summary.md:55-71,116-122
- iteration 10 implementation_alignment (ruled_out): direct source evidence; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:749-762, .opencode/skills/system-spec-kit/mcp_server/context-server.ts:677-691, .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:214-225
- iteration 6 drift_recovery_contract (ruled_out): direct source evidence; evidence=memory-drift-processing-sweep.ts:247-264, context-server.ts:2256-2284
- iteration 6 active_row_policy (ruled_out): cross-consumer evidence; evidence=active-row-predicate.ts:41-85
- iteration 6 channel_exception_telemetry (ruled_out): no discrepancy found; evidence=channel-exceptions.ts:19-77, query-router.ts:199-305
- iteration 7 orphan_sweep_budget_contract (ruled_out): Exact read sites agree with the reference contract.; evidence=.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:217-218, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:340-360
- iteration 7 enforcement_default_contract (ruled_out): No second default contradiction was evidenced.; evidence=.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:165-167,433,470-504, .opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh:56-62, .opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh:65,146-164, .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:95-100

### Clean Search Proof
- iteration 5 index_maintenance_scope (ruled_out): Direct implementation evidence supports the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/README.md:120, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:660-697,993-1080,1775-1789
- iteration 5 search_retrieval_contract (ruled_out): Direct implementation evidence supports the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/README.md:113, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:421-470,1642-1695,1841-1853
- iteration 5 save_concurrency_boundary (ruled_out): Exact usage and implementation evidence support the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:287-337, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2888
- iteration 5 context_mode_routing (ruled_out): Direct implementation evidence supports the claim.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1184-1369,1724-1822
- iteration 5 documentation_claim_drift (ruled_out): Claim-to-code review completed without contradiction.; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/README.md:15-24,109-131, .opencode/skills/system-spec-kit/mcp_server/handlers/index.ts:275,387
- iteration 8 documentation_claim_drift (ruled_out): Direct-read comparison found no unsupported or conflicting contract.; evidence=.opencode/skills/system-spec-kit/SKILL.md:95-117, .opencode/skills/system-spec-kit/scripts/README.md:103-119
- iteration 8 prune_safety_contract (ruled_out): All required safeguards are explicitly documented.; evidence=.opencode/skills/system-spec-kit/scripts/README.md:188-205
- iteration 8 cross_skill_reference_drift (ruled_out): No stale local resolver or conflicting owner claim was found.; evidence=.opencode/skills/system-deep-loop/deep-review/SKILL.md:62,414,424
- iteration 9 comment_hygiene (ruled_out): The inventory and directly reviewed documentation did not expose a comment-hygiene violation.; evidence=git diff --name-only 5afd2f6522..HEAD
- iteration 9 documentation_drift (ruled_out): Direct read found evidence-bearing claims without a documented contradiction.; evidence=.opencode/specs/system-speckit/029-memory-search-intelligence/019-validation-enforce-graduation/implementation-summary.md:71-75,158-185, .opencode/specs/system-speckit/029-memory-search-intelligence/023-self-healing-model-consolidation/implementation-summary.md:55-71,116-122
- iteration 10 implementation_alignment (ruled_out): direct source evidence; evidence=.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:749-762, .opencode/skills/system-spec-kit/mcp_server/context-server.ts:677-691, .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:214-225
- iteration 6 drift_recovery_contract (ruled_out): direct source evidence; evidence=memory-drift-processing-sweep.ts:247-264, context-server.ts:2256-2284
- iteration 6 active_row_policy (ruled_out): cross-consumer evidence; evidence=active-row-predicate.ts:41-85
- iteration 6 channel_exception_telemetry (ruled_out): no discrepancy found; evidence=channel-exceptions.ts:19-77, query-router.ts:199-305
- iteration 7 orphan_sweep_budget_contract (ruled_out): Exact read sites agree with the reference contract.; evidence=.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:217-218, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:340-360
- iteration 7 enforcement_default_contract (ruled_out): No second default contradiction was evidenced.; evidence=.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:165-167,433,470-504, .opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh:56-62, .opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh:65,146-164, .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:95-100

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 11 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
