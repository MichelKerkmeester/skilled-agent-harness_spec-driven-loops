---
title: "DLR-030 -- Atomic-state serialize-diff"
description: "Manual validation scenario for Atomic-state serialize-diff in the deep-loop-runtime skill."
version: 1.4.0.15
---

# DLR-030 -- Atomic-state serialize-diff

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-030`.

---

## 1. OVERVIEW

Adds `writeStateIfChangedAtomic()` so snapshot writers skip fsync and rename when canonical serialized state has not changed.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Atomic-state serialize-diff behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Atomic-state serialize-diff and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Compare-before-write behavior from source plus unit coverage for first write, unchanged skip, and changed-state rewrite.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/atomic-state-serialize-diff.md`.

### Steps

1. Inspect `lib/deep-loop/atomic-state.ts` for the implementation contract.
2. Inspect `tests/unit/atomic-state.vitest.ts` for the matching regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Atomic-state serialize-diff matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/atomic-state.ts` | atomic-state serialize-diff. |

### Validation

| File | Role |
|---|---|
| `tests/unit/atomic-state.vitest.ts` | Primary regression coverage for Atomic-state serialize-diff. |

---

## 5. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-030
- Feature catalog entry: `feature_catalog/04--state-safety/atomic-state-serialize-diff.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/atomic-state-serialize-diff.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/001-atomic-state-serialize-diff`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
