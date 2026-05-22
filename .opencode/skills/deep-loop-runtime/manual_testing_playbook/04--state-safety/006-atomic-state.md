---
title: "DLR-006 -- Atomic state"
description: "Manual validation scenario for Atomic state in the deep-loop-runtime skill."
---

# DLR-006 -- Atomic state

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-006`.

## 1. OVERVIEW

Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

### Why This Matters

Deep loops mutate long-lived packet state across iterations. The state-safety primitives prevent partial writes, corrupt logs, concurrent writers, and out-of-scope tool use.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm atomic state behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Atomic state and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Deterministic mutation safety evidence from source and unit tests.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/01-atomic-state.md`.

### Steps

1. Inspect `lib/deep-loop/atomic-state.ts` for the implementation contract.
2. Inspect `tests/unit/atomic-state.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Atomic state matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Source file no longer exposes the documented function, type, script argument, or output field.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script or runtime output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/atomic-state.ts` | Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure. |

### Validation

| File | Role |
|---|---|
| `tests/unit/atomic-state.vitest.ts` | Primary regression coverage for Atomic state. |

---

## 5. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-006
- Feature catalog entry: `feature_catalog/04--state-safety/01-atomic-state.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/006-atomic-state.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

