---
title: "DLR-015 -- upsert.cjs"
description: "Manual validation scenario for upsert.cjs in the deep-loop-runtime skill."
---

# DLR-015 -- upsert.cjs

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-015`.

---

## 1. OVERVIEW

Stores coverage graph nodes and edges from JSON arrays or iteration graph event files.

### Why This Matters

Consumer YAML depends on this direct script interface. A drift in args, stdout JSON, exit codes, or DB closing behavior can break deep-review, deep-research, and doctor workflows.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm upsert.cjs behaves as documented and remains aligned with its implementation and tests.
- Layer partition: script entry points runtime.
- Real user request: `Validate upsert.cjs and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: JSON-only stdout, exit code 0 for valid input, exit code 3 for invalid input, and DB close in `finally` where the script opens the graph DB.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/07--script-entry-points/upsert-script.md`.

### Steps

1. Inspect `scripts/upsert.cjs` for the implementation contract.
2. Inspect `tests/integration/upsert-script.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

upsert.cjs matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `scripts/upsert.cjs` | Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops. |

### Validation

| File | Role |
|---|---|
| `tests/integration/upsert-script.vitest.ts` | Primary regression coverage for upsert.cjs. |

---

## 5. SOURCE_METADATA

- Group: Script entry points
- Playbook ID: DLR-015
- Feature catalog entry: `feature_catalog/07--script-entry-points/upsert-script.md`
- Scenario file path: `manual_testing_playbook/07--script-entry-points/upsert-script.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

