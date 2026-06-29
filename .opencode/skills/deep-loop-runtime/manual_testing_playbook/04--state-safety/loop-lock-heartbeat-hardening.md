---
title: "DLR-036 -- Loop-lock heartbeat hardening"
description: "Manual validation scenario for Loop-lock heartbeat hardening in the deep-loop-runtime skill."
version: 1.4.0.15
---

# DLR-036 -- Loop-lock heartbeat hardening

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-036`.

---

## 1. OVERVIEW

Hardens loop-lock ownership with TTL-aware heartbeat refresh plus phase and last-activity metadata.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Loop-lock heartbeat hardening behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Loop-lock heartbeat hardening and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Heartbeat refresh updates, metadata preservation, stale holder replacement, and loop-lock unit coverage.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/loop-lock-heartbeat-hardening.md`.

### Steps

1. Inspect `lib/deep-loop/loop-lock.ts` for the implementation contract.
2. Inspect `tests/unit/loop-lock.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Loop-lock heartbeat hardening matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/loop-lock.ts` | loop-lock heartbeat hardening. |

### Validation

| File | Role |
|---|---|
| `tests/unit/loop-lock.vitest.ts` | Primary regression coverage for Loop-lock heartbeat hardening. |

---

## 5. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-036
- Feature catalog entry: `feature_catalog/04--state-safety/loop-lock-heartbeat-hardening.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/loop-lock-heartbeat-hardening.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/007-loop-lock-heartbeat-hardening`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
