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
- Review Target: specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review (spec-folder)
- Started: 2026-11-12T00:11:44.581Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-11-12T00:11:44.581Z
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 14 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/6 | complete |
| 2 | security | security | 0.14 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.36 | 0/0/4 | complete |
| 4 | maintainability | maintainability | 0.15 | 0/0/2 | complete |
| 5 | correctness (broadened terminal consolidation: re-verify active P0/P1, hunt one unreviewed cross-file defect class in the operator focus, adjudicate carried severities) | correctness/security/traceability/maintainability | 0.04 | 0/0/0 | complete |

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
- graphConvergenceScore: 0.67
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":16,"description":"Dimension coverage (44%) is below threshold (80%). 16 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}, {"count":5,"description":"5 contradiction(s) are lowering finding stability below threshold","severity":"blocking","type":"unstable_findings"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.36 -> 0.15 -> 0.04
- convergenceScore: 0.96
- openFindings: 14
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
- candidateCoverage: covered=12, ruledOut=15, deferred=2, blocked=0

### Search Debt
- iteration 2 path_traversal (deferred): tool budget exhausted at the hard ceiling; next iteration must read expandLineages and prove or disprove label containment; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3304, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:686, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3573
- iteration 2 config_dir_trust (deferred): tool budget exhausted; next iteration must read the single-executor configDir validation before any security verdict above PASS is claimed; evidence=.skilled/commands/deep/assets/deep-review-presentation.txt:137, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:686

### Ruled-Out Candidates
- iteration 1 guard_bypass (ruled_out): verified by direct read plus caller search; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397, .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:49
- iteration 1 state_precondition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:666, .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2543
- iteration 1 doc_code_contract_drift (ruled_out): verified by search; evidence=.skilled/commands/speckit/assets/speckit-implement.yaml:393
- iteration 2 guard_bypass (ruled_out): verified by direct read of the allowlist and its enforcement point; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3306, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:475
- iteration 2 input_coercion (ruled_out): verified by direct read of parser and guard; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:114, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3402
- iteration 2 prompt_injection (ruled_out): verified by direct read of every added line; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:178, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207, .skilled/commands/speckit/assets/speckit-implement.yaml:390
- iteration 3 agent_definition_drift (ruled_out): No agent definition states the policy, so there is no surface to drift.; evidence=.skilled/agents/deep-review.md
- iteration 3 playbook_drift (ruled_out): The inspected surface does not exist in this installation; the closest live playbook is consistent.; evidence=.skilled/skills/system-spec-kit/references/workflows/quick-reference.md
- iteration 3 status_drift (ruled_out): Status, criterion and percentage agree.; evidence=005-point-chat-sessions-at-authoring-card/acceptance-criteria.md:62
- iteration 4 test_fidelity (ruled_out): Behaviour is documented in the helper, and the refusal case deliberately bypasses it via rawSpawnCjs; upgrade trigger recorded in the iteration narrative.; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts
- iteration 4 comment_hygiene (ruled_out): All four added comment blocks state a durable reason only; no spec path, phase number or requirement id.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397
- iteration 5 split_carrier_drift (ruled_out): verified by direct read of all three carriers; evidence=.skilled/skills/system-spec-kit/ROUTER.md:39, .skilled/skills/system-spec-kit/ROUTER.md:163, .skilled/skills/system-spec-kit/ROUTER.md:204
- iteration 5 dangling_reference (ruled_out): no second list exists to drift; evidence=.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:25, .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:182
- iteration 5 dangling_reference (ruled_out): existence and sentinel structure confirmed; execution declined inside the read-only band; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:85, .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:152
- iteration 5 false_closure_claim (ruled_out): four disclosure surfaces plus Closeable:No; evidence=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md:96

### Clean Search Proof
- iteration 1 guard_bypass (ruled_out): verified by direct read plus caller search; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397, .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:49
- iteration 1 state_precondition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:666, .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2543
- iteration 1 doc_code_contract_drift (ruled_out): verified by search; evidence=.skilled/commands/speckit/assets/speckit-implement.yaml:393
- iteration 2 guard_bypass (ruled_out): verified by direct read of the allowlist and its enforcement point; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3306, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:475
- iteration 2 input_coercion (ruled_out): verified by direct read of parser and guard; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:114, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3402
- iteration 2 prompt_injection (ruled_out): verified by direct read of every added line; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:178, .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207, .skilled/commands/speckit/assets/speckit-implement.yaml:390
- iteration 3 agent_definition_drift (ruled_out): No agent definition states the policy, so there is no surface to drift.; evidence=.skilled/agents/deep-review.md
- iteration 3 playbook_drift (ruled_out): The inspected surface does not exist in this installation; the closest live playbook is consistent.; evidence=.skilled/skills/system-spec-kit/references/workflows/quick-reference.md
- iteration 3 status_drift (ruled_out): Status, criterion and percentage agree.; evidence=005-point-chat-sessions-at-authoring-card/acceptance-criteria.md:62
- iteration 4 test_fidelity (ruled_out): Behaviour is documented in the helper, and the refusal case deliberately bypasses it via rawSpawnCjs; upgrade trigger recorded in the iteration narrative.; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts
- iteration 4 comment_hygiene (ruled_out): All four added comment blocks state a durable reason only; no spec path, phase number or requirement id.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397
- iteration 5 split_carrier_drift (ruled_out): verified by direct read of all three carriers; evidence=.skilled/skills/system-spec-kit/ROUTER.md:39, .skilled/skills/system-spec-kit/ROUTER.md:163, .skilled/skills/system-spec-kit/ROUTER.md:204
- iteration 5 dangling_reference (ruled_out): no second list exists to drift; evidence=.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:25, .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:182
- iteration 5 dangling_reference (ruled_out): existence and sentinel structure confirmed; execution declined inside the read-only band; evidence=.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:85, .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:152
- iteration 5 false_closure_claim (ruled_out): four disclosure surfaces plus Closeable:No; evidence=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md:96

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none — terminal iteration, `stopPolicy=max-iterations` reached at 5 of 5. - Focus area: closure. All four dimensions are complete; 13 P2 advisories carry forward and no P0/P1 is active. - Reason: the loop ceiling, not convergence, ends this run; the convergence ratio for this iteration is telemetry below the 0.10 threshold only in the sense that nothing new was raised. - Rotation status: D1 correctness, D2 security, D3 traceability, D4 maintainability — 4/4 complete, plus a terminal broadened correctness pass. - Blocked/productive carry-forward: 13 active P2 plus 1 refinement of the parent phase-map advisory. The two deferred security leads stay open as scope debt. - Required evidence for any follow-on: run `check-card-sync.sh` and the contract-parity suite, and read the two deferred security leads, before promoting this packet past PASS-with-advisories. - Recovery note: none — this iteration completed normally. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
