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
- Review Target: commit range 21c4b325b5a..1d2b49e4306 (expansive-depth program, phases 001-014) (files)
- Started: 2026-11-19T04:20:12.962Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-19T04:20:12.962Z
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
| P2 (Suggestions) | 14 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/1 | complete |
| 2 | security | security | 0.50 | 0/1/1 | complete |
| 3 | traceability | traceability | 0.14 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 0.18 | 0/0/3 | complete |
| 5 | overengineering | overengineering | 0.10 | 0/0/2 | complete |
| 6 | sk-code-alignment | sk-code-alignment | 0.05 | 0/0/1 | complete |
| 7 | correctness (second pass: fan-out merge/run, upsert, divergent pivot, research reducer) | correctness | 0.00 | 0/0/0 | complete |
| 8 | overengineering | overengineering | 0.17 | 0/0/4 | complete |
| 9 | correctness: ledger schemas, legacy compat, continuity thread, coverage graph, reducers, YAML-vs-script contract | correctness | 0.00 | 0/0/0 | complete |
| 10 | traceability: checklist_evidence closure, spec_code re-record, agent_cross_runtime | traceability | 0.02 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 2 |
| traceability | covered | 2 |
| maintainability | covered | 0 |
| overengineering | covered | 6 |
| sk-code-alignment | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.17 -> 0.00 -> 0.02
- convergenceScore: 0.98
- openFindings: 16
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=20, ruledOut=19, deferred=2, blocked=0

### Search Debt
- iteration 3 catalog_drift (deferred): catalog becomes true once R1-P1-001 is fixed; tracked under R1-P1-001; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:452
- iteration 7 merge_semantics (deferred): tool budget; carried to next focus; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1000

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1183, .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1195
- iteration 1 id_collision (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:218
- iteration 1 route_proof (ruled_out): diff is comment-only; evidence=.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:569
- iteration 2 env_leak (ruled_out): buildExecutorDispatchEnv filters guardContext.env; evidence=.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:436
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:384, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:905
- iteration 2 unsafe_parse (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs
- iteration 3 spec_code_drift (ruled_out): 003 spec.md:65 scopes it and config keeps floor 2; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1195, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/spec.md:65
- iteration 4 stale_doc (ruled_out): verified by exact search; evidence=.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:616, .skilled/skills/system-deep-loop/deep-review/README.md:144
- iteration 5 speculative_layer (ruled_out): reduce-state.cjs:1966-1970 reads it; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1969
- iteration 5 speculative_layer (ruled_out): reduce-state.cjs:1940; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1940
- iteration 6 comment_hygiene (ruled_out): scan of every added line clean; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:197
- iteration 6 test_quality (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:47
- iteration 7 identity_collision (ruled_out): verified by direct read of id minting and seed skip; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:800, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:604, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:681
- iteration 7 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1504, .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1621
- iteration 7 budget_accounting (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2524, .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:223
- iteration 7 identity_collision (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:269, .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:176
- iteration 8 speculative_generality (ruled_out): current requirement earns it; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:311
- iteration 8 speculative_generality (ruled_out): two real callers; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1781
- iteration 9 contract_mismatch (ruled_out): verified by direct read of both; evidence=.skilled/commands/deep/assets/deep-review.yaml:550
- iteration 9 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:36
- iteration 9 input_validation (ruled_out): gateway runs before mv; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:895
- iteration 9 consumer_contract (ruled_out): grep of workflow and scripts found no reader; evidence=.skilled/commands/deep/assets/deep-review.yaml:2168
- iteration 10 checklist_evidence_drift (ruled_out): verified by exact search; evidence=.skilled/commands/deep/assets/deep-research.yaml:1818, .skilled/commands/deep/assets/deep-review.yaml:1932
- iteration 10 mirror_drift (ruled_out): occurrence count matches; evidence=.vibe/agents/deep-review.toml:4, .codex/agents/deep-review.toml:333
- iteration 10 spec_code_drift (ruled_out): duplicate of open registry finding; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:452

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1183, .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1195
- iteration 1 id_collision (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:218
- iteration 1 route_proof (ruled_out): diff is comment-only; evidence=.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:569
- iteration 2 env_leak (ruled_out): buildExecutorDispatchEnv filters guardContext.env; evidence=.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:436
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:384, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:905
- iteration 2 unsafe_parse (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs
- iteration 3 spec_code_drift (ruled_out): 003 spec.md:65 scopes it and config keeps floor 2; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1195, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor/spec.md:65
- iteration 4 stale_doc (ruled_out): verified by exact search; evidence=.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:616, .skilled/skills/system-deep-loop/deep-review/README.md:144
- iteration 5 speculative_layer (ruled_out): reduce-state.cjs:1966-1970 reads it; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1969
- iteration 5 speculative_layer (ruled_out): reduce-state.cjs:1940; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1940
- iteration 6 comment_hygiene (ruled_out): scan of every added line clean; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:197
- iteration 6 test_quality (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:47
- iteration 7 identity_collision (ruled_out): verified by direct read of id minting and seed skip; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:800, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:604, .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:681
- iteration 7 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1504, .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1621
- iteration 7 budget_accounting (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2524, .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:223
- iteration 7 identity_collision (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:269, .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:176
- iteration 8 speculative_generality (ruled_out): current requirement earns it; evidence=.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:311
- iteration 8 speculative_generality (ruled_out): two real callers; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1781
- iteration 9 contract_mismatch (ruled_out): verified by direct read of both; evidence=.skilled/commands/deep/assets/deep-review.yaml:550
- iteration 9 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:36
- iteration 9 input_validation (ruled_out): gateway runs before mv; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:895
- iteration 9 consumer_contract (ruled_out): grep of workflow and scripts found no reader; evidence=.skilled/commands/deep/assets/deep-review.yaml:2168
- iteration 10 checklist_evidence_drift (ruled_out): verified by exact search; evidence=.skilled/commands/deep/assets/deep-research.yaml:1818, .skilled/commands/deep/assets/deep-review.yaml:1932
- iteration 10 mirror_drift (ruled_out): occurrence count matches; evidence=.vibe/agents/deep-review.toml:4, .codex/agents/deep-review.toml:333
- iteration 10 spec_code_drift (ruled_out): duplicate of open registry finding; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:452

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (cap reached). Synthesis next. - Focus area: synthesis should carry R1-P1-001 and R2-P1-001 as the release-blocking items, and R3-P2-002 with its refinement R10-P2-001 as the checklist follow-up. - Reason: iteration 10 is maxIterations. - Rotation status: 6/6 dimensions covered. Core protocols are recorded: spec_code partial, checklist_evidence partial. - Blocked/productive carry-forward: exhausted approaches unchanged. Productive: checking checklist claims by content rather than by cited line. - Required evidence: none further this run. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
