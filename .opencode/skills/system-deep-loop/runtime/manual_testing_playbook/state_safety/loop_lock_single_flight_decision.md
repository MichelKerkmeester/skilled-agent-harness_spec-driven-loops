---
title: "DLR-037 -- Loop-lock single-flight decision"
description: "Manual validation scenario for Loop-lock single-flight decision in the runtime/ skill."
version: 1.4.0.15
---

# DLR-037 -- Loop-lock single-flight decision

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-037`.

---

## 1. OVERVIEW

Adds opt-in host-local single-flight acquisition so concurrent acquire attempts for one lock collapse behind one live holder.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Loop-lock single-flight decision behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Loop-lock single-flight decision and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Default file-lock behavior remains unchanged while opt-in host-local same-lock attempts refuse the second live holder.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/state_safety/loop_lock_single_flight_decision.md`.

### Steps

1. Inspect `lib/deep-loop/loop-lock.ts` for the implementation contract.
2. Inspect `tests/unit/loop-lock.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Loop-lock single-flight decision matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/loop-lock.ts` | loop-lock single-flight decision. |

### Validation

| File | Role |
|---|---|
| `tests/unit/loop-lock.vitest.ts` | Primary regression coverage for Loop-lock single-flight decision. |

---

## 5. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-037
- Feature catalog entry: `feature_catalog/state_safety/loop_lock_single_flight_decision.md`
- Scenario file path: `manual_testing_playbook/state_safety/loop_lock_single_flight_decision.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//008-loop-lock-single-flight-decision`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
