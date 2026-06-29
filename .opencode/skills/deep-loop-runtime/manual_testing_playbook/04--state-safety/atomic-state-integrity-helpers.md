---
title: "DLR-031 -- Atomic-state integrity helpers"
description: "Manual validation scenario for Atomic-state integrity helpers in the deep-loop-runtime skill."
version: 1.4.0.15
---

# DLR-031 -- Atomic-state integrity helpers

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-031`.

---

## 1. OVERVIEW

Adds SHA-256 integrity helpers for object and registry JSON without applying the contract to append-only JSONL.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Atomic-state integrity helpers behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Atomic-state integrity helpers and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Integrity hash, stamping, stable key order, and mismatch warning behavior from unit tests.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/atomic-state-integrity-helpers.md`.

### Steps

1. Inspect `lib/deep-loop/atomic-state.ts` for the implementation contract.
2. Inspect `tests/unit/atomic-state.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Atomic-state integrity helpers matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/atomic-state.ts` | atomic-state SHA-256 integrity helpers. |

### Validation

| File | Role |
|---|---|
| `tests/unit/atomic-state.vitest.ts` | Primary regression coverage for Atomic-state integrity helpers. |

---

## 5. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-031
- Feature catalog entry: `feature_catalog/04--state-safety/atomic-state-integrity-helpers.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/atomic-state-integrity-helpers.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/002-atomic-state-integrity-helpers`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
