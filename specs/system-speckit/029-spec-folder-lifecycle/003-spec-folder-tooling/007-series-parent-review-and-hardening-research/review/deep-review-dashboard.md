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
- Review Target: specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing (spec-folder)
- Started: 2026-10-07T05:11:34.566Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-10-07T05:11:34.566Z
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
| P1 (Required) | 4 |
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | inventory + correctness | correctness | 1.00 | 0/3/3 | complete |
| 2 | security + traceability + maintainability | security/traceability/maintainability | 0.40 | 0/0/4 | complete |
| 3 | maintainability + active-finding re-verification | maintainability/traceability | 0.17 | 0/1/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 12 |
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
- graphConvergenceScore: 0.86
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":15,"description":"Dimension coverage (57%) is below threshold (80%). 15 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.40 -> 0.17
- convergenceScore: 0.83
- openFindings: 12
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
- candidateCoverage: covered=5, ruledOut=4, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 boundary_condition (ruled_out): Guards, cutoff and cap verified by direct read; window and silence assertions present in the committed test.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1082, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1112, .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:146
- iteration 1 injection (ruled_out): Sanitized charset plus non-interpolated environment substitution removes the injection surface.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:403, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:420
- iteration 1 state_transition (ruled_out): Single node invocation per run; listing writes only to stderr; stdout purity asserted.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1286, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1768, .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:158
- iteration 2 injection (ruled_out): sanitized charset plus non-interpolated env substitution; matches iteration-1 SL-005; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:407-410, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:420-423
- iteration 3 doc_code_drift (ruled_out): field is produced by the scaffold stub and preserved by the parser; 006/007 metadata carry it; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:617, .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:1503
- iteration 3 injection (ruled_out): stderr-only, non-interpolated reads; stdout purity asserted; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1116

### Clean Search Proof
- iteration 1 boundary_condition (ruled_out): Guards, cutoff and cap verified by direct read; window and silence assertions present in the committed test.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1082, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1112, .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:146
- iteration 1 injection (ruled_out): Sanitized charset plus non-interpolated environment substitution removes the injection surface.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:403, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:420
- iteration 1 state_transition (ruled_out): Single node invocation per run; listing writes only to stderr; stdout purity asserted.; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1286, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1768, .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:158
- iteration 2 injection (ruled_out): sanitized charset plus non-interpolated env substitution; matches iteration-1 SL-005; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:407-410, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:420-423
- iteration 2 stale_label (not_applicable): prior-run findings; re-confirmed active and recorded in this iteration narrative, not re-filed; evidence=specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/iterations/iteration-001.md:207
- iteration 3 doc_code_drift (ruled_out): field is produced by the scaffold stub and preserved by the parser; 006/007 metadata carry it; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:617, .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:1503
- iteration 3 logic_duplication (not_applicable): two copies only; abstraction deferred per the two-is-not-a-pattern restraint; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts:21-41
- iteration 3 injection (ruled_out): stderr-only, non-interpolated reads; stdout purity asserted; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1116
- iteration 3 stale_label (not_applicable): recorded as corroborating context for R1-P1-002; the gate does not require the stale label, and a separate finding would duplicate the registered label drift; evidence=.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js:104-105

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
