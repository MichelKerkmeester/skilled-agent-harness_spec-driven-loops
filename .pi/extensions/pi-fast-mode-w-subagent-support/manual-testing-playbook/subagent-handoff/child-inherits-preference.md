---
title: "FAST-010 -- Child inherits the preference"
description: "This scenario validates the subagent handoff for `FAST-010`. It focuses on confirming that a child Pi process launched with the handoff variable set starts with Fast Mode matching the parent."
stage: routing
version: 1.0.0.0
---

# FAST-010 -- Child inherits the preference

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-010`.

---

## 1. OVERVIEW

This scenario validates the subagent handoff for `FAST-010`. It focuses on confirming that a child Pi process started with `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` in its environment begins with Fast Mode enabled, even when the child's own persisted state is off.

### Why This Matters

The whole point of this fork is that a parent session with Fast Mode on hands the same preference to the subagents it spawns. A parent writes the handoff variable when Fast Mode is on, and children inherit it through ordinary process-environment copying.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-010` and confirm the expected signals without contradictory evidence.

- Objective: confirm a child process inherits Fast Mode through the handoff variable.
- Real user request: `When I have fast mode on and Pi spawns a subagent, the subagent should also be in fast mode.`
- Prompt: `bash: PI_FAST_MODE_W_SUBAGENT_SUPPORT=1 pi --model openai-codex/gpt-5.6-luna`
- Expected execution process: set the child's persisted state to off, then launch a child with the handoff variable set to `1`, which mimics what a parent in Fast Mode exports.
- Expected signals: the child session starts with Fast Mode enabled and the `fast` indicator visible on LUNA, despite the persisted state being off.
- Desired user-visible outcome: the child follows the parent's preference rather than its own stale state.
- Pass/fail: PASS if the child starts enabled with the indicator when the variable is `1`; FAIL if it starts disabled.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: a spawned child should inherit Fast Mode.
2. Set the child's persisted state to off first, so inheritance is the only reason it could be on.
3. Launch the child with the handoff variable set to `1`.
4. Observe the initial state.
5. Record the indicator and the variable used.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-010 | Child inherits the preference | Verify the child inherits Fast Mode via the handoff variable | `bash: PI_FAST_MODE_W_SUBAGENT_SUPPORT=1 pi --model openai-codex/gpt-5.6-luna` | 1. `bash: pi --model openai-codex/gpt-5.6-luna` -> 2. `pi> /fast off` -> 3. `key: Ctrl+C` -> 4. `bash: PI_FAST_MODE_W_SUBAGENT_SUPPORT=1 pi --model openai-codex/gpt-5.6-luna` | Step 2: persisted state set to disabled; Step 4: child starts with the `fast` indicator visible, overriding the disabled persisted state | The persisted state before the child launch, the environment variable used, and the child indicator | PASS if the child starts enabled with the indicator when `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1`; FAIL if it starts disabled | 1. Confirm the persisted state was `false` after Step 2. 2. Confirm the variable was exported for the child launch. 3. Relaunch without the variable and confirm the child then starts disabled, proving the difference came from the handoff. |

### Optional Supplemental Checks

Repeat Step 4 with `PI_FAST_MODE_W_SUBAGENT_SUPPORT=0` and confirm the child starts disabled, proving the variable is read strictly.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../src/handoff.ts` | Read and write of the handoff environment variable |
| `../../src/index.ts` | Session-start precedence: flag, then inherited value, then persisted config |
| `../../tests/propagation.test.ts` | Regression anchor for handoff propagation |

---

## 5. SOURCE METADATA

- Group: Subagent Handoff
- Playbook ID: FAST-010
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `subagent-handoff/child-inherits-preference.md`
