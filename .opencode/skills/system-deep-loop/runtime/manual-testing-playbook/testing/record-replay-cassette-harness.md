---
title: "DLR-051 -- Record-replay cassette harness"
description: "Manual validation scenario for Record-replay cassette harness in the runtime/ skill."
version: 1.4.0.15
---

# DLR-051 -- Record-replay cassette harness

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-051`.

---

## 1. OVERVIEW

Adds record/replay helpers for script-level cassette regressions with redaction and hermetic environment integration.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Record-replay cassette harness behaves as documented and remains aligned with its implementation and tests.
- Layer partition: testing runtime.
- Real user request: `Validate Record-replay cassette harness and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Cassette recording, deterministic replay, redacted path/timestamp placeholders, and convergence/fanout regression coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/testing/record-replay-cassette-harness.md`.

### Steps


1. Inspect `tests/helpers/spawn-cjs.ts` for the matching regression coverage.
2. Inspect `tests/integration/convergence-script.vitest.ts` for the matching regression coverage.
3. Inspect `tests/unit/fanout-run.vitest.ts` for the matching regression coverage.
4. Run or inspect the matching test assertions for this feature.
5. Capture the source lines, command output, or test assertions that prove the expected signals.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Record-replay cassette harness matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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


### Validation

| File | Role |
|---|---|
| `tests/helpers/spawn-cjs.ts` | Primary regression coverage for Record-replay cassette harness. |
| `tests/integration/convergence-script.vitest.ts` | Primary regression coverage for Record-replay cassette harness. |
| `tests/unit/fanout-run.vitest.ts` | Primary regression coverage for Record-replay cassette harness. |

---

## 5. SOURCE_METADATA

- Group: Testing
- Playbook ID: DLR-051
- Feature catalog entry: `feature-catalog/testing/record-replay-cassette-harness.md`
- Scenario file path: `manual-testing-playbook/testing/record-replay-cassette-harness.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/007-testing/002-record-replay-cassette-harness`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
