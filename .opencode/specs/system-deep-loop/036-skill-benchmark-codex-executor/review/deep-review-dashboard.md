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
- Review Target: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md (files)
- Started: 2026-07-15T19:42:12.593Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-07-15T19:42:12.593Z
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
| run-001 | correctness — inventory pass + headline-figure verification | correctness | 1.00 | 0/1/0 | complete |
| run-002 | traceability — exact evidence-anchor and claim-citation audit | traceability | 0.83 | 0/2/1 | complete |
| run-003 | maintainability | maintainability | 1.00 | 0/2/1 | complete |
| run-004 | correctness+traceability adversarial re-verification of all active P1 findings | correctness/traceability/maintainability | 0.00 | 0/2/2 | complete |
| run-005 | maintainability — adjusted final recommendations synthesis | maintainability/traceability/correctness | 0.00 | 0/2/4 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | pending | 0 |
| traceability | covered | 0 |
| maintainability | covered | 6 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: STOP_BLOCKED
- graphBlockers: {"type":"uncovered_dimensions","severity":"blocking"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 12
- persistentSameSeverity: 2
- severityChanged: 3
- repeatedFindings (deprecated combined bucket): 5

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=14, ruledOut=13, deferred=4, blocked=0

### Search Debt
- iteration 5 generalization_scope (deferred): Apply the scoped wording in a separate implementation/edit pass.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:67, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:71, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:13, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:13, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:13, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:13, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:13
- iteration 5 citation_anchor_precision (deferred): Transfer the adjusted list and cited questions into the target during follow-up.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:99, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:103, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:107, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:115, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:119
- iteration 5 measurement_semantics (deferred): The guide must be inserted into the read-only analysis in a separate edit pass.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/review/iterations/iteration-003.md:27, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/review/iterations/iteration-003.md:28, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/review/iterations/iteration-003.md:29
- iteration 5 provenance_precision (deferred): Attach a non-report audit citation or adopt the narrower provenance text.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:3, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:1, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:1, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:1

### Ruled-Out Candidates
- iteration 1 gold_recall_arithmetic_doc (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1751
- iteration 1 gold_recall_arithmetic_code (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1731
- iteration 1 surface_match_coverage (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:2715
- iteration 1 null_gold_semantics (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:181, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:661
- iteration 1 efficiency_accounting (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:499, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:12
- iteration 1 cross_runtime_aggregate_parity (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:12
- iteration 1 observed_activity_aggregation (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1751, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1731
- iteration 1 path_prefix_classification (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1648, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1751
- iteration 2 findings_table_aggregate_parity (ruled_out): No value mismatch found; only the table's citation precision is defective.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:11, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:11, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:11, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:12
- iteration 2 recommendation_gap_validity (ruled_out): Report projections confirm the recommendation premises.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:15, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:17, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:15, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:17
- iteration 2 open_question_gap_validity (ruled_out): No invented report gap found.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:121, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:124, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1231, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:2715
- iteration 3 per_scenario_anomaly (ruled_out): Complete-population projections reproduced the stated family and activity patterns.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:53, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:55, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:63, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189
- iteration 5 new_high_severity_synthesis_regression (ruled_out): All material issues are already represented by the adjudicated active register.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/review/iterations/iteration-004.md:1, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:73

### Clean Search Proof
- iteration 1 gold_recall_arithmetic_doc (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1751
- iteration 1 gold_recall_arithmetic_code (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1731
- iteration 1 surface_match_coverage (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:2715
- iteration 1 null_gold_semantics (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:181, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:661
- iteration 1 efficiency_accounting (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:499, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:12
- iteration 1 cross_runtime_aggregate_parity (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier1-deep-improvement-luna-codex.report.json:12
- iteration 1 observed_activity_aggregation (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1751, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1731
- iteration 1 path_prefix_classification (ruled_out): Verified against every applicable report row and aggregate field.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1648, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1751
- iteration 2 findings_table_aggregate_parity (ruled_out): No value mismatch found; only the table's citation precision is defective.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:11, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:11, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:11, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:12
- iteration 2 recommendation_gap_validity (ruled_out): Report projections confirm the recommendation premises.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-mcp-tooling-luna-opencode.report.json:12, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:15, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:17, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:15, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:17
- iteration 2 open_question_gap_validity (ruled_out): No invented report gap found.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:121, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:124, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:1231, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:2715
- iteration 3 per_scenario_anomaly (ruled_out): Complete-population projections reproduced the stated family and activity patterns.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:53, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:55, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:63, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-code-luna-opencode.report.json:189
- iteration 5 new_high_severity_synthesis_regression (ruled_out): All material issues are already represented by the adjudicated active register.; evidence=.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/review/iterations/iteration-004.md:1, .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:73

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 4 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
