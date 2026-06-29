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
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/atomic-state-serialize-diff.md`.

### Steps

1. Inspect `lib/deep-loop/atomic-state.ts` for the implementation contract.
2. Inspect `tests/unit/atomic-state.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
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

## 5. ADVERSARIAL REGRESSION

> Regression guard for a fixed deep-review finding. This scenario is adversarial: it PASSES only
> while the bug stays fixed and is phrased to FAIL the moment the regression returns.

### Adversarial Contract

- Bug under guard: two concurrent diff-gated appends could race so one row was dropped, losing
  state-log history.
- Must-stay-true invariant: concurrent diff-gated appends must preserve every row.
- Pass/fail: PASS only if the command below exits 0 AND `tests/unit/atomic-state.vitest.ts` still
  contains the named assertion; FAIL if that test is missing, renamed, skipped, or exits non-zero —
  any of which means the lost-row regression has returned.

### Adversarial Steps

1. Run `cd .opencode/skills/deep-loop-runtime && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/atomic-state.vitest.ts` and require EXIT 0.
2. Confirm `tests/unit/atomic-state.vitest.ts` asserts `preserves both rows from concurrent diff-gated appends`.
3. Record PASS only with captured EXIT 0 output; a prose-only, skipped, or absent test is FAIL.

### Regression Anchor

| File | Role |
|---|---|
| `tests/unit/atomic-state.vitest.ts` | Fails if a concurrent diff-gated append drops a row. |

---

## 6. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-030
- Feature catalog entry: `feature_catalog/04--state-safety/atomic-state-serialize-diff.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/atomic-state-serialize-diff.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/001-atomic-state-serialize-diff`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
