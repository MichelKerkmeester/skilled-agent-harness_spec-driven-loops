---
title: "DLR-007 -- JSONL repair"
description: "Manual validation scenario for JSONL repair in the deep-loop-runtime skill."
---

# DLR-007 -- JSONL repair

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-007`.

---

## 1. OVERVIEW

Repairs corrupted JSONL tails and appends valid records without preserving partial trailing lines.

### Why This Matters

Deep loops mutate long-lived packet state across iterations. The state-safety primitives prevent partial writes, corrupt logs, concurrent writers, and out-of-scope tool use.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm jsonl repair behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate JSONL repair and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Deterministic mutation safety evidence from source and unit tests.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/02-jsonl-repair.md`.

### Steps

1. Inspect `lib/deep-loop/jsonl-repair.ts` for the implementation contract.
2. Inspect `tests/unit/jsonl-repair.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

JSONL repair matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/jsonl-repair.ts` | Valid-prefix detection, corrupt-tail truncation, byte accounting, and append-after-repair. |

### Validation

| File | Role |
|---|---|
| `tests/unit/jsonl-repair.vitest.ts` | Primary regression coverage for JSONL repair. |

---

## 5. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-007
- Feature catalog entry: `feature_catalog/04--state-safety/02-jsonl-repair.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/007-jsonl-repair.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

