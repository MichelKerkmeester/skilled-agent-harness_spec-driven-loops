---
title: "DRV-062 -- graphlessFallbackGate STOP blocker"
description: "Verify the legal-stop decision tree blocks STOP with named gate graphlessFallbackGate when graphCoverageMode is graphless_fallback but the searchLedger has no fallback evidence."
---

# DRV-062 -- graphlessFallbackGate STOP blocker

This document captures the realistic user-testing contract, execution flow, and metadata for `DRV-062`.

## 1. OVERVIEW

Exercise the `graphlessFallbackGate` added to the legal-stop decision tree. When `searchCoverage.graphCoverageMode` is `graphless_fallback`, the iteration must cite fallback ledger evidence (direct reads, exact searches, semantic-search status, producer/consumer trace, negative-test inspection). If `searchLedger` is empty, STOP must be blocked with the named gate — not silently allowed via empty graph CONTINUE.

### Why This Matters

Empty graph CONTINUE has historically meant "no graph data, proceed to inline vote" with no separate proof requirement. After Phase F, a graphless review must explicitly prove fallback coverage. Otherwise an operator can ship a clean PASS without ever searching for bugs the way the v2 contract demands.

## 2. SCENARIO CONTRACT

- Objective: Confirm legal-stop decision tree emits `blocked_stop` with `graphlessFallbackGate` in `blocked_gates[]` when `graphCoverageMode: 'graphless_fallback'` is paired with empty `searchLedger` on non-trivial scope.
- Layer partition: workflow YAML (`deep_start-review-loop_auto.yaml` step `step_check_convergence`) + iteration record `searchCoverage.graphCoverageMode`.
- Real user request: `Run a standard-scope v2 review iteration with graphCoverageMode set to graphless_fallback and empty searchLedger; confirm STOP is blocked by graphlessFallbackGate.`
- Expected signals: blocked_stop event with `blocked_gates[]` containing `graphlessFallbackGate`; recovery_strategy mentions adding cited fallback ledger rows (direct_read / exact_grep / semantic_search / producer_consumer_trace / negative_test_inspection methods).
- Pass/fail: PASS if `blocked_gates[]` contains `graphlessFallbackGate` AND the recovery message names fallback methods; FAIL if STOP succeeds OR the gate is reported as a generic graph error.

## 3. TEST EXECUTION

### Prerequisites

- `review-depth-convergence.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/` (note: marked `it.todo` pending workflow-runner integration — manual harness required today).
- A standard or complex v2 session can set `graphCoverageMode` to `graphless_fallback`.
- The session can leave `searchLedger` empty for the gate to trip.

### Steps

1. Prepare a standard or complex v2 session with `searchCoverage.graphCoverageMode: 'graphless_fallback'`.
2. Leave `searchLedger` empty.
3. Run the convergence or workflow path that exercises `step_check_convergence`.
4. Inspect the blocked_stop output for `blocked_gates[]` containing `graphlessFallbackGate`.
5. Confirm the recovery_strategy explains that fallback proof is missing rather than requiring graph mode.
6. Add at least one cited `searchLedger` row using a fallback method (`direct_read`, `exact_grep`, `semantic_search`, `code_graph_status_check`, `producer_consumer_trace`, or `negative_test_inspection`) and rerun to verify the gate condition changes.

### Expected Outcome

With `graphCoverageMode: 'graphless_fallback'` and empty `searchLedger`, the review cannot legally stop and the blocked_stop output names `graphlessFallbackGate`. After cited fallback evidence is added, the gate stops blocking.

### Failure Modes

- The run asks for graph mode instead: verify the input uses `graphCoverageMode: 'graphless_fallback'`, not absence-of-mode.
- The gate does not fire: confirm `searchLedger` is empty and the scope is not `trivial` (trivial+skip exemption bypasses the gate).
- The rerun still blocks after adding proof: inspect whether the new `searchLedger` row uses a recognized fallback method AND whether its `evidenceRefs` are non-empty.

## 4. SOURCE REFERENCES

- Workflow YAML: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` (`step_check_convergence` legal-stop decision tree, graphlessFallbackGate branch).
- Confirm mirror: `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`.
- Schema: `.opencode/skills/deep-review/references/state_format.md` (`graphCoverageMode` enum + fallback-method conventions).
- Fixture: `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-convergence.vitest.ts` (workflow-runner integration TODO).
- ADR: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/006-complexity-candidate-saturation-gates/decision-record.md`.

## 5. SOURCE_METADATA

- Group: Review-depth v2 rollout
- Playbook ID: DRV-062
- Layer partition: workflow YAML legal-stop
- Expected verdict mode: GREEN (blocked_stop emitted) then GREEN after fallback evidence added
- Sourcing methodology: 131-deep-skill-evolution arc completion (8 phase children shipped 2026-05-22)
- Preflight: documented in 116 parent spec.md phase-map
- Wall-time estimate: ~10 min
