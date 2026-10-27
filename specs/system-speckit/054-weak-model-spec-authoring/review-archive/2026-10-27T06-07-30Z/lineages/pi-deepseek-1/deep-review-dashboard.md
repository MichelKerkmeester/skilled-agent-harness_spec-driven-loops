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
- Review Target: specs/system-speckit/054-weak-model-spec-authoring (spec-folder)
- Started: 2026-10-25T17:52:41Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-pi-deepseek-1-1792950661620-vss1cp
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
| P1 (Required) | 4 |
| P2 (Suggestions) | 14 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/4 | complete |
| 2 | security | security | 0.75 | 0/2/1 | complete |
| 3 | traceability | traceability | 0.50 | 0/1/1 | complete |
| 4 | maintainability | maintainability | 0.50 | 0/0/2 | complete |
| 5 | traceability | traceability | 0.25 | 0/0/1 | complete |
| 6 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 7 | traceability | traceability | 0.20 | 0/0/1 | complete |
| 8 | maintainability | maintainability | 0.20 | 0/0/1 | complete |
| 9 | traceability | traceability | 0.20 | 0/0/1 | complete |
| 10 | completeness | traceability | 0.20 | 0/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 8 |
| security | covered | 3 |
| traceability | covered | 4 |
| maintainability | covered | 3 |

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
- Last 3 ratios: 0.20 -> 0.20 -> 0.20
- convergenceScore: 0.80
- openFindings: 18
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
- candidateCoverage: covered=30, ruledOut=22, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 path_traversal (ruled_out): Covered by an active wave-1 P1; re-reporting would duplicate across the merge.; evidence=review/lineages/deepseek/review-report.md
- iteration 2 credential_exposure (ruled_out): No credential material appears in the packet or its reports.; evidence=specs/system-speckit/054-weak-model-spec-authoring/spec.md:91
- iteration 2 command_injection (ruled_out): Variables are quoted and derived from mktemp; no user input reaches a command position.; evidence=example-drift-guard-catches-leak.md:51-70
- iteration 3 dangling_evidence_pointer (ruled_out): No acceptance evidence path in phase 009 is missing from disk.; evidence=009-authoring-benchmark-and-closeout/acceptance-criteria.md:55
- iteration 3 number_misstatement (ruled_out): README aggregates match the CSV for the deciding set.; evidence=benchmark/reports/2026-10-25--model-eval--authoring-baseline/results-amend3.csv:11-13
- iteration 4 registry_drift (ruled_out): The registry and the stamps agree, and a dedicated test guards them.; evidence=templates/spec-kit-docs.json:4, runtime/cli/tests/template-version-parity.vitest.ts:1
- iteration 4 playbook_index_gap (ruled_out): The packet's scenarios are all indexed; the wider gap predates the packet and is out of scope.; evidence=manual-testing-playbook.md:341-348
- iteration 5 dangling_catalog_path (ruled_out): The two dangling paths sit in out-of-scope leaves that precede the packet.; evidence=feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md:1
- iteration 5 catalog_index_gap (ruled_out): All four leaves are indexed exactly once.; evidence=feature-catalog/feature-catalog.md:1
- iteration 5 addon_fill_line_gap (ruled_out): Already an active wave-1 P2 finding; re-reporting would duplicate across the merge.; evidence=runtime/cli/tests/template-fill-guidance.vitest.ts:6
- iteration 6 evidence_contamination (ruled_out): Hits are deleted-path names from a status listing, never file contents.; evidence=amend3/fresh2/runs/T005-3.hits:1, benchmark/reports/2026-10-25--model-eval--authoring-baseline/results-amend3.csv:11-13
- iteration 6 audit_unavailable (ruled_out): Every deciding run resolved exactly one session.; evidence=amend3/fresh2/runs/T005-1.audit:1
- iteration 7 unmet_acceptance_row (ruled_out): Every row reads Met.; evidence=009-authoring-benchmark-and-closeout/acceptance-criteria.md:55
- iteration 7 dangling_evidence_pointer (ruled_out): No acceptance evidence path is missing.; evidence=005-weak-model-authoring-card/acceptance-criteria.md:61
- iteration 7 baseline_number_drift (ruled_out): Both baselines reproduce exactly against goal.md and the report tables.; evidence=001-template-drift-census-and-baseline/scratch/baseline-swe-l3/baseline.json:1
- iteration 8 l3plus_label_drift (ruled_out): All six notes carry the corrected opening sentence.; evidence=templates/core/tasks.md.tmpl:229
- iteration 8 missing_nested_changelog (ruled_out): One file per phase exists.; evidence=changelog/changelog-054-root.md:1
- iteration 8 stale_version_carrier (ruled_out): Both carriers agree.; evidence=changelog/v2.9.0.0.md:1
- iteration 9 mirror_divergence (ruled_out): Every mirror that ships the agent carries the same authoring row.; evidence=.claude/agents/markdown.md:194
- iteration 10 missing_commit (ruled_out): Every cited commit resolves.; evidence=goal.md:127
- iteration 10 scope_leak (ruled_out): Every created path named by the scope table exists.; evidence=spec.md:105-108

### Clean Search Proof
- iteration 1 path_traversal (ruled_out): Covered by an active wave-1 P1; re-reporting would duplicate across the merge.; evidence=review/lineages/deepseek/review-report.md
- iteration 2 credential_exposure (ruled_out): No credential material appears in the packet or its reports.; evidence=specs/system-speckit/054-weak-model-spec-authoring/spec.md:91
- iteration 2 command_injection (ruled_out): Variables are quoted and derived from mktemp; no user input reaches a command position.; evidence=example-drift-guard-catches-leak.md:51-70
- iteration 3 dangling_evidence_pointer (ruled_out): No acceptance evidence path in phase 009 is missing from disk.; evidence=009-authoring-benchmark-and-closeout/acceptance-criteria.md:55
- iteration 3 number_misstatement (ruled_out): README aggregates match the CSV for the deciding set.; evidence=benchmark/reports/2026-10-25--model-eval--authoring-baseline/results-amend3.csv:11-13
- iteration 4 registry_drift (ruled_out): The registry and the stamps agree, and a dedicated test guards them.; evidence=templates/spec-kit-docs.json:4, runtime/cli/tests/template-version-parity.vitest.ts:1
- iteration 4 playbook_index_gap (ruled_out): The packet's scenarios are all indexed; the wider gap predates the packet and is out of scope.; evidence=manual-testing-playbook.md:341-348
- iteration 5 dangling_catalog_path (ruled_out): The two dangling paths sit in out-of-scope leaves that precede the packet.; evidence=feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md:1
- iteration 5 catalog_index_gap (ruled_out): All four leaves are indexed exactly once.; evidence=feature-catalog/feature-catalog.md:1
- iteration 5 addon_fill_line_gap (ruled_out): Already an active wave-1 P2 finding; re-reporting would duplicate across the merge.; evidence=runtime/cli/tests/template-fill-guidance.vitest.ts:6
- iteration 6 evidence_contamination (ruled_out): Hits are deleted-path names from a status listing, never file contents.; evidence=amend3/fresh2/runs/T005-3.hits:1, benchmark/reports/2026-10-25--model-eval--authoring-baseline/results-amend3.csv:11-13
- iteration 6 audit_unavailable (ruled_out): Every deciding run resolved exactly one session.; evidence=amend3/fresh2/runs/T005-1.audit:1
- iteration 7 unmet_acceptance_row (ruled_out): Every row reads Met.; evidence=009-authoring-benchmark-and-closeout/acceptance-criteria.md:55
- iteration 7 dangling_evidence_pointer (ruled_out): No acceptance evidence path is missing.; evidence=005-weak-model-authoring-card/acceptance-criteria.md:61
- iteration 7 baseline_number_drift (ruled_out): Both baselines reproduce exactly against goal.md and the report tables.; evidence=001-template-drift-census-and-baseline/scratch/baseline-swe-l3/baseline.json:1
- iteration 8 l3plus_label_drift (ruled_out): All six notes carry the corrected opening sentence.; evidence=templates/core/tasks.md.tmpl:229
- iteration 8 missing_nested_changelog (ruled_out): One file per phase exists.; evidence=changelog/changelog-054-root.md:1
- iteration 8 stale_version_carrier (ruled_out): Both carriers agree.; evidence=changelog/v2.9.0.0.md:1
- iteration 9 mirror_divergence (ruled_out): Every mirror that ships the agent carries the same authoring row.; evidence=.claude/agents/markdown.md:194
- iteration 9 missing_agent (not_applicable): The absence predates the packet and sits outside its declared change surface.; evidence=.skilled/agents/markdown.md:208
- iteration 10 missing_commit (ruled_out): Every cited commit resolves.; evidence=goal.md:127
- iteration 10 scope_leak (ruled_out): Every created path named by the scope table exists.; evidence=spec.md:105-108

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
