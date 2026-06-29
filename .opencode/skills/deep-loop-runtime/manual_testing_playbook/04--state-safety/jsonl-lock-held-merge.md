---
title: "DLR-035 -- JSONL lock-held merge"
description: "Manual validation scenario for JSONL lock-held merge in the deep-loop-runtime skill."
version: 1.4.0.15
---

# DLR-035 -- JSONL lock-held merge

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-035`.

---

## 1. OVERVIEW

Adds a lock-held JSONL merge path for fan-out salvage so recovered events are deduplicated before atomic rewrite.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm JSONL lock-held merge behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate JSONL lock-held merge and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Merge dedupe, reread-under-lock behavior, atomic rewrite, and fanout-salvage integration tests.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/jsonl-lock-held-merge.md`.

### Steps

1. Inspect `lib/deep-loop/jsonl-repair.ts` for the implementation contract.
2. Inspect `scripts/fanout-salvage.cjs` for the implementation contract.
3. Inspect `tests/unit/jsonl-repair.vitest.ts` for the matching regression coverage.
4. Run or inspect the matching test assertions for this feature.
5. Capture the source lines, command output, or test assertions that prove the expected signals.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

JSONL lock-held merge matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/jsonl-repair.ts` | JSONL lock-held merge for fan-out salvage. |
| `scripts/fanout-salvage.cjs` | JSONL lock-held merge for fan-out salvage. |

### Validation

| File | Role |
|---|---|
| `tests/unit/jsonl-repair.vitest.ts` | Primary regression coverage for JSONL lock-held merge. |

---

## 5. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-035
- Feature catalog entry: `feature_catalog/04--state-safety/jsonl-lock-held-merge.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/jsonl-lock-held-merge.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/006-jsonl-lock-held-merge`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
