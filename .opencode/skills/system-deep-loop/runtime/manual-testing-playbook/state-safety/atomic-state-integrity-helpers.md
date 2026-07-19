---
title: "DLR-031 -- Atomic-state integrity helpers"
description: "Manual validation scenario for Atomic-state integrity helpers in the runtime/ skill."
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
- Real user request: `Validate Atomic-state integrity helpers and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Integrity hash, stamping, stable key order, and mismatch warning behavior from unit tests.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/state-safety/atomic-state-integrity-helpers.md`.

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

## 5. ADVERSARIAL REGRESSION

> Regression guard for a fixed deep-review finding. This scenario is adversarial: it PASSES only
> while the bug stays fixed and is phrased to FAIL the moment the regression returns.

### Adversarial Contract

- Bug under guard: `writeStateAtomic` given a non-representable top-level state (e.g. `undefined`)
  silently created or replaced the target file with corrupt content instead of throwing.
- Must-stay-true invariant: a non-representable top-level state must THROW and leave both a fresh
  target and any prior file untouched.
- Pass/fail: PASS only if the command below exits 0 AND `tests/unit/atomic-state.vitest.ts` still
  contains the named assertions; FAIL if either is missing, renamed, skipped, or exits non-zero —
  any of which means the silent-corruption regression has returned.

### Adversarial Steps

1. Run `cd .opencode/skills/runtime/ && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/atomic-state.vitest.ts` and require EXIT 0.
2. Confirm `tests/unit/atomic-state.vitest.ts` asserts `rejects non-representable top-level state without creating a file` and `rejects non-representable top-level state without replacing the prior file`.
3. Record PASS only with captured EXIT 0 output; a prose-only, skipped, or absent test is FAIL.

### Regression Anchor

| File | Role |
|---|---|
| `tests/unit/atomic-state.vitest.ts` | Fails if a non-representable state writes or clears a file instead of throwing. |

---

## 6. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-031
- Feature catalog entry: `feature-catalog/state-safety/atomic-state-integrity-helpers.md`
- Scenario file path: `manual-testing-playbook/state-safety/atomic-state-integrity-helpers.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//002-atomic-state-integrity-helpers`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
