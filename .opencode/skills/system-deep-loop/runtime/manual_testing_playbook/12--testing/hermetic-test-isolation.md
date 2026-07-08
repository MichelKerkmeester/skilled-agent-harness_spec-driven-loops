---
title: "DLR-050 -- Hermetic test isolation"
description: "Manual validation scenario for Hermetic test isolation in the runtime/ skill."
version: 1.4.0.15
---

# DLR-050 -- Hermetic test isolation

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-050`.

---

## 1. OVERVIEW

Adds shared hermetic test environments so runtime tests can run in parallel without touching real HOME, temp, or database paths.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Hermetic test isolation behaves as documented and remains aligned with its implementation and tests.
- Layer partition: testing runtime.
- Real user request: `Validate Hermetic test isolation and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Per-test HOME/DB/temp isolation, child-env injection, cleanup behavior, and parallel fanout-run test coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/12--testing/hermetic-test-isolation.md`.

### Steps


1. Inspect `tests/helpers/spawn-cjs.ts` for the matching regression coverage.
2. Inspect `tests/unit/fanout-run.vitest.ts` for the matching regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Hermetic test isolation matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|


### Validation

| File | Role |
|---|---|
| `tests/helpers/spawn-cjs.ts` | Primary regression coverage for Hermetic test isolation. |
| `tests/unit/fanout-run.vitest.ts` | Primary regression coverage for Hermetic test isolation. |

---

## 5. SOURCE_METADATA

- Group: Testing
- Playbook ID: DLR-050
- Feature catalog entry: `feature_catalog/12--testing/hermetic-test-isolation.md`
- Scenario file path: `manual_testing_playbook/12--testing/hermetic-test-isolation.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/007-testing/001-hermetic-test-isolation`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
