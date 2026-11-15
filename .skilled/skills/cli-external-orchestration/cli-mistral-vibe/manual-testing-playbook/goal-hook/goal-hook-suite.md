---
title: "VIB-GOAL-001 -- Goal hook suite"
description: "This scenario validates that the Vibe goal-hook suite passes for a bound packet, no packet and malformed input, and that the hook fails open."
version: 1.0.0.0
---

# VIB-GOAL-001 -- Goal hook suite

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-GOAL-001`.

---

## 1. OVERVIEW

This scenario validates the goal slice renderer through its three-case suite. It focuses on the three inputs a session-start hook can receive: a bound packet, no packet and malformed input.

### Why This Matters

The hook injects text into a session's first message, and a hook that throws would cost the session its context. The contract is fail-open: a bad input yields an empty context and exit `0`, never a blocked session. The three cases pin that behavior before a keyed run depends on it.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the goal hook renders a bound packet's slice, returns nothing without a packet, and survives malformed input.
- Real user request: `Run the Vibe goal-hook suite and tell me whether the bound-packet, no-packet and malformed-input cases all pass.`
- Prompt: `Run the Vibe goal-hook suite and report the pass and fail counts. Name the three cases it covers, and stop if the malformed-input case no longer exits cleanly.`
- Expected execution process: Run the suite from the repository root -> read the three test lines -> read the summary counts -> read the exit code.
- Expected signals: The run exits `0`. The summary prints `tests 3`, `pass 3`, `fail 0`. The three cases are `bound packet`, `no packet` and `malformed input`.
- Evidence: The command transcript with the three test lines, the summary counts and the exit code.
- Desired user-visible outcome: A clear statement that all three cases pass and that malformed input still fails open.
- Pass/fail: PASS if the suite exits `0` with `pass 3` and `fail 0`. FAIL if any case fails, if a case is missing, or if the suite exits non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the suite from the repository root.
2. Read the three test lines before the summary.
3. Read the summary counts and the exit code.
4. Treat a missing case as a failure even when the suite exits `0`.

### Commands

```bash
node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-14.
- Observed: the command exited `0` with `tests 3`, `pass 3`, `fail 0`, `cancelled 0`, `skipped 0` and `todo 0`.
- Observed: the three cases printed as `bound packet`, `no packet` and `malformed input`, all passing.
- Note: the suite is hermetic. It renders the slice from a fixture packet and never starts `vibe` or reads a live session.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-GOAL-001 | Goal hook suite | Prove the bound, no-packet and malformed cases pass | `Run the Vibe goal-hook suite and report the pass and fail counts. Name the three cases it covers, and stop if the malformed-input case no longer exits cleanly.` | 1. `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` -> 2. read the three test lines -> 3. read the summary counts and the exit code | Step 1: exit `0`, `tests 3`, `pass 3`, `fail 0`. Step 2: `bound packet`, `no packet` and `malformed input` all pass | The command transcript with the three test lines, the summary counts and the exit code | PASS if the suite exits `0` with `pass 3` and `fail 0`. FAIL if a case fails or is missing | 1. Read the failing case name. 2. Confirm the renderer still reads the packet path from the payload. 3. Confirm a malformed payload still returns an empty context and exit `0` |

### Failure Triage

1. Read the failing case name; each one names the input shape it exercises.
2. If the bound case fails, confirm the fixture packet still has a `goal.md` and that `goal.cjs packet` prints a `chat_slice`.
3. If the no-packet case fails, confirm an absent packet path yields an empty context rather than an error.
4. If the malformed case fails, confirm the hook catches the parse error and exits `0`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and the hook boundary |
| [SKILL.md](../../SKILL.md) | The session-start hook and the injection contract |
| [guards-and-hooks.md](../../references/guards-and-hooks.md) | The `session_start` seam, `additional_context` and the fail-open rule |
| [runtime-folder-and-sync.md](../../references/runtime-folder-and-sync.md) | The trust gate that decides whether a project hook loads |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/goal/vibe/goal-vibe.test.mjs` | The suite this scenario runs |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | The slice renderer under test |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | The composing hook that calls the renderer |

---

## 5. SOURCE METADATA

- Group: Goal And Context Hook
- Playbook ID: VIB-GOAL-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook-suite.md`
