---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet (second pass, lineage `deepseek-review-2`).

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification (spec-folder)
- Started: 2026-09-11T10:52:16Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: PASS (advisories)
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-deepseek-review-2-1789123936134-6zq196
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
- Swept: concurrency-on-the-log, extractor-versus-validator measurement, plugin-versus-core parity, YAML executable instructions, packet-claim reconciliation
- Pivot lineage: none yet
- Remaining frontier: host merge semantics for two Devin `additionalContext` emitters (F107)

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 0 |
| P2 (Suggestions) | 7 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness — concurrency between two sessions on the packet log | correctness/security | 1.00 | 0/0/1 | complete |
| 2 | correctness — the validator's goal measurement against the runtime extractor | correctness/maintainability | 1.00 | 0/0/1 | complete |
| 3 | traceability — speckit YAML packet_goal blocks and the Devin adapter chain | traceability/correctness | 1.00 | 0/0/2 | complete |
| 4 | traceability — plugin versus core parity: workspace resolution and packet fields | traceability/correctness | 1.00 | 0/0/2 | complete |
| 5 | traceability — the packet's own fix claims against the shipped code | traceability/maintainability | 1.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 1 |
| traceability | covered | 5 |
| maintainability | covered | 2 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded. One direction is blocked on host behavior rather than evidence: Devin's merge rule for two `additionalContext` emitters (F107).

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
- One direction remains blocked on host behavior (Devin merge semantics, F107); everything else in the round-two frontier was read or reproduced.
- graphCoverageMode: graphless_fallback

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered] — maximum iteration count reached.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- No active P0 or P1 in this lineage; the packet's SC-003 stays satisfied by this pass.
- 7 active P2 advisories, three of which are reproduced: silent log-row loss under divergent state directories (F101), a validator measurement that can fail a document the runtime accepts (F102), and an incomplete parity fix on the primary runtime (F103).

<!-- /ANCHOR:active-risks -->
