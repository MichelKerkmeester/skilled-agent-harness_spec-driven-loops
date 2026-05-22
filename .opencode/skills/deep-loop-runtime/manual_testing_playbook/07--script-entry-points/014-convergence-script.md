---
title: "DLR-014 -- convergence.cjs"
description: "Manual validation scenario for convergence.cjs in the deep-loop-runtime skill."
---

# DLR-014 -- convergence.cjs

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-014`.

## 1. OVERVIEW

Computes graph-aware CONTINUE, STOP_ALLOWED, or STOP_BLOCKED decisions for a session namespace.

### Why This Matters

Consumer YAML depends on this direct script interface. A drift in args, stdout JSON, exit codes, or DB closing behavior can break deep-review, deep-research, and doctor workflows.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm convergence.cjs behaves as documented and remains aligned with its implementation and tests.
- Layer partition: script entry points runtime.
- Real user request: `Validate convergence.cjs and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/07--script-entry-points/01-convergence-script.md`.

### Steps

1. Inspect `scripts/convergence.cjs` for the implementation contract.
2. Inspect `tests/integration/convergence-script.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

convergence.cjs matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `scripts/convergence.cjs` | Direct replacement for `deep_loop_graph_convergence`; emits graph decision bindings. |

### Validation

| File | Role |
|---|---|
| `tests/integration/convergence-script.vitest.ts` | Primary regression coverage for convergence.cjs. |

---

## 5. SOURCE_METADATA

- Group: Script entry points
- Playbook ID: DLR-014
- Feature catalog entry: `feature_catalog/07--script-entry-points/01-convergence-script.md`
- Scenario file path: `manual_testing_playbook/07--script-entry-points/014-convergence-script.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

