---
title: "DLR-048 -- Single-loop telemetry heartbeat"
description: "Manual validation scenario for Single-loop telemetry heartbeat in the runtime/ skill."
version: 1.4.0.15
---

# DLR-048 -- Single-loop telemetry heartbeat

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-048`.

---

## 1. OVERVIEW

Adds single-loop telemetry heartbeat rows for started, progress, and terminal lifecycle events with no-change write suppression.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Single-loop telemetry heartbeat behaves as documented and remains aligned with its implementation and tests.
- Layer partition: observability runtime.
- Real user request: `Validate Single-loop telemetry heartbeat and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Started/progress/terminal heartbeat producers, single-loop row shape, no-change suppression, and YAML parse coverage.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/observability/single-loop-telemetry-heartbeat.md`.

### Steps

1. Inspect `.opencode/commands/deep/assets/deep_research_auto.yaml` for the implementation contract.
2. Inspect `lib/deep-loop/atomic-state.ts` for the implementation contract.
3. Inspect `tests/unit/atomic-state.vitest.ts` for the matching regression coverage.
4. Run `bash: cd .opencode/skills/runtime/ && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/atomic-state.vitest.ts` and require EXIT 0.
5. Capture the source lines and EXIT 0 test command output that prove the expected signals.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Single-loop telemetry heartbeat matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | single-loop telemetry heartbeat. |
| `lib/deep-loop/atomic-state.ts` | single-loop telemetry heartbeat. |

### Validation

| File | Role |
|---|---|
| `tests/unit/atomic-state.vitest.ts` | Primary regression coverage for Single-loop telemetry heartbeat. |

---

## 5. SOURCE_METADATA

- Group: Observability
- Playbook ID: DLR-048
- Feature catalog entry: `feature_catalog/observability/single-loop-telemetry-heartbeat.md`
- Scenario file path: `manual_testing_playbook/observability/single-loop-telemetry-heartbeat.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/002-single-loop-telemetry-heartbeat`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
