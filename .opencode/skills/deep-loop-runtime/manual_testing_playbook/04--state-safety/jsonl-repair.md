---
title: "DLR-007 -- JSONL repair"
description: "Manual validation scenario for JSONL repair in the deep-loop-runtime skill."
version: 1.4.0.4
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
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/04--state-safety/jsonl-repair.md`.

### Steps

1. Inspect `lib/deep-loop/jsonl-repair.ts` for the implementation contract.
2. Inspect `tests/unit/jsonl-repair.vitest.ts` for the primary regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
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

## 5. ADVERSARIAL REGRESSION

> Regression guard for a fixed deep-review finding. This scenario is adversarial: it PASSES only
> while the bug stays fixed and is phrased to FAIL the moment the regression returns.

### Adversarial Contract

- Bug under guard: appending a record to a JSONL file whose last line lacked a trailing newline
  merged the new record onto the prior line, corrupting both at the record boundary.
- Must-stay-true invariant: appends must keep every record parseable at line boundaries even when
  the prior content lacked a clean terminator.
- Pass/fail: PASS only if the command below exits 0 AND `tests/unit/jsonl-repair.vitest.ts` still
  contains the named assertions; FAIL if either is missing, renamed, skipped, or exits non-zero —
  any of which means the boundary-corruption regression has returned.

### Adversarial Steps

1. Run `cd .opencode/skills/deep-loop-runtime && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/jsonl-repair.vitest.ts` and require EXIT 0.
2. Confirm `tests/unit/jsonl-repair.vitest.ts` asserts `appends records without rewriting existing content` and `strips corrupt trailing lines even when the corrupt line ends with a newline`.
3. Record PASS only with captured EXIT 0 output; a prose-only, skipped, or absent test is FAIL.

### Regression Anchor

| File | Role |
|---|---|
| `tests/unit/jsonl-repair.vitest.ts` | Fails if an append after a missing terminator corrupts a record boundary. |

---

## 6. SOURCE_METADATA

- Group: State safety
- Playbook ID: DLR-007
- Feature catalog entry: `feature_catalog/04--state-safety/jsonl-repair.md`
- Scenario file path: `manual_testing_playbook/04--state-safety/jsonl-repair.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

