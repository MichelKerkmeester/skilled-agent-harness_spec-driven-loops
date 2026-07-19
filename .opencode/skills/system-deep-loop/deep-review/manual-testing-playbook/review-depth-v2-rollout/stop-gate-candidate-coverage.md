---
title: "DRV-061 -- candidateCoverageGate STOP blocker"
description: "Verify the legal-stop decision tree blocks STOP with named gate candidateCoverageGate when required bug classes remain uncovered."
version: 1.11.0.9
---

# DRV-061 -- candidateCoverageGate STOP blocker

This document captures the realistic user-testing contract, execution flow, and metadata for `DRV-061`.

## 1. OVERVIEW

Exercise the `candidateCoverageGate` added to the legal-stop decision tree. A standard or complex v2 review with unresolved `searchDebt` (or `searchCoverage.requiredBugClasses` that are not in `covered[]`) must NOT be allowed to STOP. The blocked_stop event must name `candidateCoverageGate` and surface the remaining debt as evidence.

### Why This Matters

Without the gate, a review can terminate with PASS verdict even though the agent never searched the required bug classes. The whole review-depth v2 rollout is gated on this: a no-finding STOP is only legitimate when the search debt is zero (or the iteration is explicitly trivial-scope with cited evidence).

## 2. SCENARIO CONTRACT

- Objective: Confirm legal-stop decision tree emits `blocked_stop` with `candidateCoverageGate` in `blocked_gates[]` when v2 search debt remains for non-trivial scope.
- Layer partition: workflow YAML (`deep-review-auto.yaml` step `step_check_convergence`) + reducer state (`searchDebt`, `candidateCoverage`).
- Real user request: `Run a standard-scope v2 review iteration with one required bug class uncovered and confirm STOP is blocked by candidateCoverageGate.`
- Expected signals: blocked_stop event with `blocked_gates[]` containing `candidateCoverageGate`. Recovery_strategy mentions resolving deferred/blocked obligations. Reducer `searchDebt` non-empty.
- Pass/fail: PASS if `blocked_gates[]` contains `candidateCoverageGate` AND `searchDebt` is non-empty. FAIL if STOP succeeds OR gate is absent from the blocker payload.

## 3. TEST EXECUTION

### Prerequisites

- `review-depth-convergence.vitest.ts` exists under `.opencode/skills/system-deep-loop/runtime/tests/integration/` (note: marked `it.todo` pending workflow-runner integration, manual harness required today).
- A standard or complex v2 session can set `searchCoverage` with uncovered required bug classes.
- Reducer state can expose `candidateCoverage` and `searchDebt`.

### Steps

1. Prepare a standard or complex v2 session with `searchCoverage.requiredBugClasses` containing at least one bug class.
2. Leave that required class out of `covered[]`, `ruledOut[]`, `deferred[]`, and `blocked[]` so `candidateCoverage` remains incomplete.
3. Run the convergence or workflow path that exercises `step_check_convergence`.
4. Inspect the blocked_stop output for `blocked_gates[]` containing `candidateCoverageGate`.
5. Confirm the blocked output includes the remaining `searchDebt`.
6. Record the gate name and the uncovered class evidence in the scenario notes.

### Expected Outcome

The review cannot legally stop. The blocked_stop output names `candidateCoverageGate` in `blocked_gates[]`, and the evidence points to incomplete `candidateCoverage` plus remaining `searchDebt`.

### Failure Modes

- STOP succeeds: verify the input scope is not `trivial` and required coverage is actually missing.
- The blocked output is generic: inspect whether `candidateCoverageGate` was dropped before the final gate payload.
- `searchDebt` is empty: rerun the reducer path and confirm the uncovered class is represented in reducer state.

## 4. SOURCE REFERENCES

- Workflow YAML: `.opencode/commands/deep/assets/deep-review-auto.yaml` (`step_check_convergence` legal-stop decision tree).
- Confirm mirror: `.opencode/commands/deep/assets/deep-review-confirm.yaml`.
- Reducer: `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (registry exposing `candidateCoverage`, `searchDebt`).
- Fixture: `.opencode/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` (workflow-runner integration TODO).
- ADR: complexity-candidate-saturation-gates decision record (see this skill's changelog for provenance).

## 5. SOURCE_METADATA

- Group: Review-depth v2 rollout
- Playbook ID: DRV-061
- Layer partition: workflow YAML legal-stop
- Expected verdict mode: GREEN (blocked_stop emitted)
- Sourcing methodology: review-depth v2 rollout
- Preflight: documented in the review-depth v2 rollout phase-map
- Wall-time estimate: ~10 min
