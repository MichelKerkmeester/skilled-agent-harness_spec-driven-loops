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
- Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization (spec-folder)
- Started: 2026-07-18T14:43:18.153Z
- Status: COMPLETE
- Iteration: 5 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-b-1784385520599-ecg4bg
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

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
| P1 (Required) | 6 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: lifecycle state, dependency ordering, implementation-summary truthfulness, and runtime-claim support | - | 1.00 | 0/0/0 | complete |
| 2 | security: corpus-to-prompt and transport trust boundaries | - | 0.60 | 0/3/0 | complete |
| 3 | traceability: first full spec_code and checklist_evidence core-protocol audit | - | 0.25 | 0/1/0 | complete |
| 4 | maintainability: ownership, shared-contract duplication, concrete locations, sequencing, and rollback independence across phases 004-010 | - | 0.11 | 0/0/1 | complete |
| 5 | cross-reference stabilization: replay active P1-001 through P1-006 and confirm P2-007 classification | - | 0.00 | 0/6/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 3 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 4.67
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.25 -> 0.11 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
- persistentSameSeverity: 7
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 7

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=11, ruledOut=2, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 4 consumer_field_redefinition (ruled_out): Direct plan language requires reference/consumption of the phase-007 owner rather than copied fields.; evidence=008-interface-audit-pilots/plan.md:81-88, 009-foundations-motion/plan.md:97-105
- iteration 4 rollback_independence (ruled_out): Direct rollback contracts prove phase-local reversibility; phase 008 additionally requires per-consumer flags.; evidence=006-md-generator-study-exemplars/plan.md:149-153, 008-interface-audit-pilots/plan.md:198-209, 008-interface-audit-pilots/checklist.md:163-168, 009-foundations-motion/plan.md:155-160, 010-open-design-transport/plan.md:143-147

### Clean Search Proof
- iteration 4 consumer_field_redefinition (ruled_out): Direct plan language requires reference/consumption of the phase-007 owner rather than copied fields.; evidence=008-interface-audit-pilots/plan.md:81-88, 009-foundations-motion/plan.md:97-105
- iteration 4 rollback_independence (ruled_out): Direct rollback contracts prove phase-local reversibility; phase 008 additionally requires per-consumer flags.; evidence=006-md-generator-study-exemplars/plan.md:149-153, 008-interface-audit-pilots/plan.md:198-209, 008-interface-audit-pilots/checklist.md:163-168, 009-foundations-motion/plan.md:155-160, 010-open-design-transport/plan.md:143-147

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: convergence decision - Focus area: reducer refresh and synthesis of the stable active finding set - Reason: all four dimensions, both core protocols, and the required stabilization replay are complete with `newFindingsRatio=0` - Rotation status: stabilization complete; legal convergence recommended - Blocked/productive carry-forward: preserve graphless evidence; do not retry memory, graph, broad rediscovery, duplicate-root, or ruled-out severity routes without changed target files - Required evidence: reducer verification that state/delta/narrative agree and that active counts remain P0=0, P1=6, P2=1 Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
