---
title: "DLR-047 -- Persisted-wait crash resume"
description: "Manual validation scenario for Persisted-wait crash resume in the runtime/ skill."
version: 1.4.0.15
---

# DLR-047 -- Persisted-wait crash resume

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-047`.

---

## 1. OVERVIEW

Persists a pre-dispatch wait checkpoint and resumes waiting state before dispatch after a crash restart.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Persisted-wait crash resume behaves as documented and remains aligned with its implementation and tests.
- Layer partition: fan-out runtime.
- Real user request: `Validate Persisted-wait crash resume and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Wait checkpoint persistence, resume-waiting startup branch, null legacy migration behavior, and fanout-run unit coverage.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/fanout/persisted_wait_crash_resume.md`.

### Steps

1. Inspect `scripts/fanout-run.cjs` for the implementation contract.
2. Inspect `.opencode/commands/deep/assets/deep_research_auto.yaml` for the implementation contract.
3. Inspect `tests/unit/fanout-run.vitest.ts` for the matching regression coverage.
4. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
5. Capture the source lines and EXIT 0 test command output that prove the expected signals.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Persisted-wait crash resume matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `scripts/fanout-run.cjs` | persisted-wait crash resume. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | persisted-wait crash resume. |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | Primary regression coverage for Persisted-wait crash resume. |

---

## 5. SOURCE_METADATA

- Group: Fan-out
- Playbook ID: DLR-047
- Feature catalog entry: `feature_catalog/fanout/persisted_wait_crash_resume.md`
- Scenario file path: `manual_testing_playbook/fanout/persisted_wait_crash_resume.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//018-persisted-wait-crash-resume`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
