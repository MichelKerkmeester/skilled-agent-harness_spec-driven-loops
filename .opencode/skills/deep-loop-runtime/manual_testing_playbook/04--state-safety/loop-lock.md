---
title: "DLR-008 -- Loop lock"
description: "Manual validation scenario for Loop lock in the deep-loop-runtime skill."
version: 1.4.0.4
---

# DLR-008 -- Loop lock

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-008`.

---

## 1. OVERVIEW

Provides a single-writer lock with stale-lock detection, heartbeat refresh, and owner-scoped release.

### Why This Matters

Deep loops mutate long-lived packet state across iterations. The state-safety primitives prevent partial writes, corrupt logs, concurrent writers, and out-of-scope tool use.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm loop lock behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Loop lock and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Deterministic mutation safety evidence from source and unit tests.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/loop-lock.md`.

### Steps

1. Inspect `lib/deep-loop/loop-lock.ts` for the implementation contract.
2. Inspect `tests/unit/loop-lock.vitest.ts` for the primary regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Loop lock matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/loop-lock.ts` | Lock file schema, live-holder refusal, stale replacement, heartbeat refresh, and owner-only release. |

### Validation

| File | Role |
|---|---|
| `tests/unit/loop-lock.vitest.ts` | Primary regression coverage for Loop lock. |

---

## 5. ADVERSARIAL REGRESSION

> Regression guard for a fixed deep-review finding. This scenario is adversarial: it PASSES only
> while the bug stays fixed and is phrased to FAIL the moment the regression returns.

### Adversarial Contract

- Bug under guard: a lock concurrently reclaimed after a stale heartbeat-refresh read could be
  clobbered by the stale refresher, producing two live owners (refresh-vs-reclaim split-brain).
- Must-stay-true invariant: a refresh that read stale lock metadata must NOT overwrite a lock that
  another holder has already reclaimed.
- Pass/fail: PASS only if the command below exits 0 AND `tests/unit/loop-lock.vitest.ts` still
  contains the named assertion; FAIL if that test is missing, renamed, skipped, or exits non-zero —
  any of which means the split-brain regression has returned.

### Adversarial Steps

1. Run `cd .opencode/skills/deep-loop-runtime && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/loop-lock.vitest.ts` and require EXIT 0.
2. Confirm `tests/unit/loop-lock.vitest.ts` asserts `does not clobber a lock reclaimed after a stale refresh read`.
3. Record PASS only with captured EXIT 0 output; a prose-only, skipped, or absent test is FAIL.

### Regression Anchor

| File | Role |
|---|---|
| `tests/unit/loop-lock.vitest.ts` | Fails if a stale refresh clobbers a freshly reclaimed lock. |

---

## 6. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-008
- Feature catalog entry: `feature_catalog/04--state-safety/loop-lock.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/loop-lock.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

