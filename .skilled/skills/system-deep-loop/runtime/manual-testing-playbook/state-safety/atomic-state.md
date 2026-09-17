---
title: "DLR-006 -- Atomic state"
description: "Manual validation scenario for Atomic state in the runtime/ skill."
version: 1.4.0.4
---

# DLR-006 -- Atomic state

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-006`.

---

## 1. OVERVIEW

Writes JSON state files through temp-file, fsync, rename, and cleanup semantics.

### Why This Matters

Deep loops mutate long-lived packet state across iterations. The state-safety primitives prevent partial writes, corrupt logs, concurrent writers, and out-of-scope tool use.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm atomic state behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Atomic state and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Deterministic mutation safety evidence from source and unit tests.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/state-safety/atomic-state.md`.

### Prompt

- Prompt: `Validate Atomic state and report whether the current source, script surface, and tests agree with the runtime/ contract.`

### Commands

1. Inspect `lib/deep-loop/atomic-state.ts` for the implementation contract.
2. Inspect `tests/unit/atomic-state.vitest.ts` for the primary regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS or FAIL with rationale; record SKIP only when a named sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevents the command from running.

### Expected Outcome

Atomic state matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Evidence

- Source excerpts from `lib/deep-loop/atomic-state.ts` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/unit/atomic-state.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Source file no longer exposes the documented function, type, script argument, or output field.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script or runtime output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/atomic-state.ts` | Atomic JSON serialization, temp-file writes, fsync, rename, and cleanup on failure. |

### Validation

| File | Role |
|---|---|
| `tests/unit/atomic-state.vitest.ts` | Primary regression coverage for Atomic state. |

---

## 5. SOURCE METADATA

- Group: State safety
- Playbook ID: DLR-006
- Feature catalog entry: `feature-catalog/state-safety/atomic-state.md`
- Scenario file path: `manual-testing-playbook/state-safety/atomic-state.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

