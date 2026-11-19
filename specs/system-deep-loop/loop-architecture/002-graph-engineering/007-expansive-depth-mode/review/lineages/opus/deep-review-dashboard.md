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
- Review Target: 21c4b325b5a..de32abbb74d -- .skilled/skills/system-deep-loop .skilled/commands/deep .skilled/agents .claude/agents .codex/agents .pi/agents .dsh/agents .vibe/agents (the expansive-depth program: runtime code and tests, command YAML and presentation, agents and their runtime mirrors, skill docs, playbooks and catalogs; specs/ evidence and spec-packet artifacts excluded) (files)
- Started: 2026-11-19T18:38:12.356Z
- Status: COMPLETE
- Iteration: 14 of 24
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-opus-1795113418367-pvzn7z
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
| P2 (Suggestions) | 12 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-002: correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | Frontier node F-1-004: correctness | correctness | 0.50 | 0/0/2 | complete |
| 3 | Frontier node F-1-006: correctness | correctness | 0.20 | 0/0/1 | complete |
| 4 | Frontier node F-1-002: security | security | 0.29 | 0/0/2 | complete |
| 5 | Frontier node F-1-004: security | security | 0.00 | 0/0/0 | complete |
| 6 | Frontier node F-1-006: security | security | 0.13 | 0/0/1 | complete |
| 7 | Frontier node F-1-004: traceability | traceability | 0.25 | 0/1/1 | complete |
| 8 | Frontier node F-1-002: traceability | traceability | 0.00 | 0/0/0 | complete |
| 9 | Frontier node F-1-006: traceability | traceability | 0.04 | 0/0/1 | complete |
| 10 | Frontier node F-1-002: maintainability | maintainability | 0.30 | 0/1/1 | complete |
| 11 | Frontier node F-1-006: maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 12 | Frontier node F-2-007: correctness | correctness | 0.05 | 0/0/1 | complete |
| 13 | RECOVERY: escalate severity review; least-covered dimension maintainability | maintainability | 0.14 | 0/1/1 | complete |
| 14 | Blocked-stop recovery: graphless fallback evidence | correctness | 0.04 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 7 |
| security | covered | 3 |
| traceability | covered | 1 |
| maintainability | covered | 3 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
### Iteration 14 — blocked by [graphlessFallbackGate]
- Recovery: Add cited graphless fallback ledger rows (direct_read or exact_grep with row-level evidenceRefs) for state_transition and contract_drift before STOP.
- Gate results: 0: ?, 1: ?, 2: ?, 3: ?, 4: ?, 5: ?, 6: ?, 7: ?, 8: ?
- Timestamp: 2026-11-19T18:59:44.393Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.05 -> 0.14 -> 0.04
- convergenceScore: 0.95
- openFindings: 14
- persistentSameSeverity: 2
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 3

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=9, ruledOut=14, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:895
- iteration 2 input_validation (ruled_out): verified by direct read; evidence=.skilled/commands/deep/assets/deep-review.yaml:535
- iteration 3 runtime_parity (ruled_out): verified by occurrence count; evidence=.vibe/agents/deep-review.toml:4
- iteration 4 path_traversal (ruled_out): operator/workflow-controlled argument; evidence=.skilled/commands/deep/assets/deep-research.yaml:1923
- iteration 4 prototype_pollution (ruled_out): language semantics; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:151
- iteration 5 shell_injection (ruled_out): verified by diff read; evidence=.skilled/commands/deep/assets/deep-review.yaml:425, .skilled/commands/deep/assets/deep-review.yaml:395
- iteration 5 dry_run_boundary (ruled_out): verified by direct read; evidence=.skilled/commands/deep/assets/deep-review.yaml:957
- iteration 6 permission_widening (ruled_out): verified by diff; evidence=.codex/agents/deep-review.toml:5
- iteration 6 destructive_command (ruled_out): pattern scan clean; evidence=.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/live-expansive-review-two-node-frontier.md:49
- iteration 8 spec_code_alignment (ruled_out): verified against requirements; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:656
- iteration 8 test_coverage (ruled_out): coverage map; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts:333
- iteration 11 duplication (ruled_out): measured overlap; evidence=.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:1
- iteration 11 portability (ruled_out): pattern scan clean; evidence=.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:1
- iteration 12 boundary_condition (ruled_out): verified; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts:534
- iteration 14 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:895

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:895
- iteration 2 input_validation (ruled_out): verified by direct read; evidence=.skilled/commands/deep/assets/deep-review.yaml:535
- iteration 3 runtime_parity (ruled_out): verified by occurrence count; evidence=.vibe/agents/deep-review.toml:4
- iteration 4 path_traversal (ruled_out): operator/workflow-controlled argument; evidence=.skilled/commands/deep/assets/deep-research.yaml:1923
- iteration 4 prototype_pollution (ruled_out): language semantics; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:151
- iteration 5 shell_injection (ruled_out): verified by diff read; evidence=.skilled/commands/deep/assets/deep-review.yaml:425, .skilled/commands/deep/assets/deep-review.yaml:395
- iteration 5 dry_run_boundary (ruled_out): verified by direct read; evidence=.skilled/commands/deep/assets/deep-review.yaml:957
- iteration 6 permission_widening (ruled_out): verified by diff; evidence=.codex/agents/deep-review.toml:5
- iteration 6 destructive_command (ruled_out): pattern scan clean; evidence=.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/live-expansive-review-two-node-frontier.md:49
- iteration 8 spec_code_alignment (ruled_out): verified against requirements; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:656
- iteration 8 test_coverage (ruled_out): coverage map; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts:333
- iteration 11 duplication (ruled_out): measured overlap; evidence=.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:1
- iteration 11 portability (ruled_out): pattern scan clean; evidence=.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:1
- iteration 12 boundary_condition (ruled_out): verified; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts:534
- iteration 14 state_transition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:895

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 4 nodes (0 open, 0 active, 2 answered, 2 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 12 of 12 iterations spent
- Budget depth2: 1 of 8.4 iterations spent
- Budget depth3: 0 of 11 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: correctness - Focus area: stop check; synthesis when the gate passes - Reason: blocked-stop recovery evidence recorded - Rotation status: frontier closed; all dimensions covered - Required evidence: convergence.cjs gate output Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Latest blocked_stop at run 14: graphlessFallbackGate. Recovery: Add cited graphless fallback ledger rows (direct_read or exact_grep with row-level evidenceRefs) for state_transition and contract_drift before STOP..

<!-- /ANCHOR:active-risks -->
