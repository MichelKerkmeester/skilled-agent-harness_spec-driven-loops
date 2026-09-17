---
title: "DLR-046 -- Fan-out stall watchdog"
description: "Manual validation scenario for Fan-out stall watchdog in the runtime/ skill."
version: 1.4.0.15
---

# DLR-046 -- Fan-out stall watchdog

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-046`.

---

## 1. OVERVIEW

Adds an opt-in fan-out stall watchdog that aborts and requeues lineages when pending lag crosses a configured ceiling.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Fan-out stall watchdog behaves as documented and remains aligned with its implementation and tests.
- Layer partition: fan-out runtime.
- Real user request: `Validate Fan-out stall watchdog and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: No-op default behavior, lag-ceiling event emission, abort-and-requeue handling, and required positive threshold validation.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/fanout/fanout-stall-watchdog.md`.

### Prompt

- Prompt: `Validate Fan-out stall watchdog and report whether the current source, script surface, and tests agree with the runtime/ contract.`

### Commands

1. Inspect `scripts/fanout-pool.cjs` for the implementation contract.
2. Inspect `tests/unit/fanout-pool.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS or FAIL with rationale; record SKIP only when a named sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevents the command from running.

### Expected Outcome

Fan-out stall watchdog matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Evidence

- Source excerpts from `scripts/fanout-pool.cjs` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/unit/fanout-pool.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-pool.cjs` | fanout stall watchdog. |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-pool.vitest.ts` | Primary regression coverage for Fan-out stall watchdog. |

---

## 5. SOURCE METADATA

- Group: Fan-out
- Playbook ID: DLR-046
- Feature catalog entry: `feature-catalog/fanout/fanout-stall-watchdog.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-stall-watchdog.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//017-fanout-stall-watchdog`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
