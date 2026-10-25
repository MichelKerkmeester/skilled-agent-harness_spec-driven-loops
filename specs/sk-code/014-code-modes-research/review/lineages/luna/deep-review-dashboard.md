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
- Review Target: specs/sk-code/014-code-modes-research (spec-folder)
- Started: 2026-10-25T16:25:02Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-luna-1792944728998-jpqv4b
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

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
| P1 (Required) | 2 |
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness/traceability | 1.00 | 0/1/0 | complete |
| 2 | security | security/traceability | 0.50 | 0/2/0 | complete |
| 3 | traceability | traceability/maintainability | 0.09 | 0/2/1 | complete |
| 4 | maintainability | maintainability/traceability | 0.04 | 0/2/2 | complete |
| 5 | traceability | correctness/security/traceability/maintainability | 0.08 | 0/2/3 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
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
- Last 3 ratios: 0.09 -> 0.04 -> 0.08
- convergenceScore: 0.92
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=5, ruledOut=3, deferred=4, blocked=0

### Search Debt
- iteration 1 acceptance_status_coherence (deferred): Focused acceptance-state reconciliation is scheduled in iteration 3.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:42, specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:92
- iteration 2 credential_exposure (deferred): A new credential scan is outside the evidence gathered in this pass.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:165
- iteration 3 acceptance_row_provenance (deferred): The review does not rerun acceptance commands or validators.; evidence=specs/sk-code/014-code-modes-research/001-quality-mode-research/acceptance-criteria.md:94, specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:94
- iteration 5 recommendation_source_traceability (deferred): This pass did not reopen every recommendation source tag across both long research syntheses.; evidence=specs/sk-code/014-code-modes-research/001-quality-mode-research/implementation-summary.md:58, specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:58

### Ruled-Out Candidates
- iteration 2 unapproved_external_write (ruled_out): The opened evidence identifies bounded spec.md edits authorized by parent D1; it does not establish another unapproved path.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-state.jsonl:3, specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-state.jsonl:15, specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-state.jsonl:23, specs/sk-code/014-code-modes-research/spec.md:112
- iteration 3 closure_status_consistency (ruled_out): Both phase summaries and the parent map say Complete; the only contradiction is the acceptance metadata.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:3, specs/sk-code/014-code-modes-research/spec.md:137, specs/sk-code/014-code-modes-research/spec.md:138
- iteration 4 cleanup_state_conflict (ruled_out): The task and current path state both support deletion; only the summary is stale.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:185, specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:128

### Clean Search Proof
- iteration 2 unapproved_external_write (ruled_out): The opened evidence identifies bounded spec.md edits authorized by parent D1; it does not establish another unapproved path.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-state.jsonl:3, specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-state.jsonl:15, specs/sk-code/014-code-modes-research/002-review-mode-research/research/deep-research-state.jsonl:23, specs/sk-code/014-code-modes-research/spec.md:112
- iteration 3 closure_status_consistency (ruled_out): Both phase summaries and the parent map say Complete; the only contradiction is the acceptance metadata.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:3, specs/sk-code/014-code-modes-research/spec.md:137, specs/sk-code/014-code-modes-research/spec.md:138
- iteration 4 cleanup_state_conflict (ruled_out): The task and current path state both support deletion; only the summary is stale.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:185, specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:128
- iteration 4 resource_map_reference (not_applicable): Resource-map completeness is outside the specific cleanup-path hypothesis and root resource map is absent.; evidence=specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:128
- iteration 5 agent_runtime_parity (not_applicable): This is a findings-only research packet and no agent/runtime implementation changes are in scope.; evidence=specs/sk-code/014-code-modes-research/spec.md:112, specs/sk-code/014-code-modes-research/002-review-mode-research/decision-record.md:166
- iteration 5 feature_catalog_alignment (not_applicable): No feature catalog code or implementation files are part of the target.; evidence=specs/sk-code/014-code-modes-research/spec.md:101, specs/sk-code/014-code-modes-research/spec.md:103

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 4 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
