---
title: "FAST-005 -- Toggle cycles state"
description: "This scenario validates the bare toggle for `FAST-005`. It focuses on confirming that repeated `/fast` flips state between on and off with a matching notification each time."
stage: routing
version: 1.0.0.0
---

# FAST-005 -- Toggle cycles state

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-005`.

---

## 1. OVERVIEW

This scenario validates the bare toggle for `FAST-005`. It focuses on confirming that running `/fast` with no argument flips Fast Mode between on and off, and that each flip reports the new state.

### Why This Matters

The bare `/fast` is the fastest way an operator flips the mode. Each press must give an unambiguous confirmation, or the operator loses track of whether it is on.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-005` and confirm the expected signals without contradictory evidence.

- Objective: confirm bare `/fast` alternates state with matching notifications.
- Real user request: `Just toggle fast mode for me.`
- Prompt: `/fast`
- Expected execution process: on a LUNA session that starts disabled, run `/fast` twice.
- Expected signals: the first `/fast` shows `Fast Mode enabled` and the indicator appears; the second `/fast` shows `Fast Mode disabled` and the indicator disappears.
- Desired user-visible outcome: each toggle confirms the resulting state.
- Pass/fail: PASS if the two notifications alternate `Fast Mode enabled` then `Fast Mode disabled` and the indicator follows; FAIL if a notification is missing, repeats the same state, or the indicator does not follow.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: flip Fast Mode with the bare command.
2. Start from a known disabled state on a LUNA session.
3. Run `/fast` twice.
4. Confirm the notifications and indicator alternate.
5. Record both notification lines in order.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-005 | Toggle cycles state | Verify bare `/fast` alternates state | `/fast` | 1. `bash: pi --model openai-codex/gpt-5.6-luna` -> 2. `pi> /fast off` -> 3. `pi> /fast` -> 4. `pi> /fast` | Step 2: state disabled, no indicator; Step 3: `Fast Mode enabled` and indicator appears; Step 4: `Fast Mode disabled` and indicator disappears | The ordered pair of notification lines and indicator visibility after each toggle | PASS if the notifications alternate `Fast Mode enabled` then `Fast Mode disabled` and the indicator follows; FAIL if a line is missing, repeats, or the indicator does not follow | 1. Confirm the session started disabled after Step 2. 2. Confirm the active model is `openai-codex/gpt-5.6-luna` so the indicator is expected to show when enabled. 3. Read `.pi/pi-fast-mode-w-subagent-support-config.json` after each toggle and confirm `enabled` alternates. |

### Optional Supplemental Checks

Run a third `/fast` and confirm it returns to `Fast Mode enabled`, proving the cycle is stable.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../src/index.ts` | Command handler that toggles and posts the notification |
| `../../src/commands.ts` | Argument parsing for bare toggle |
| `../../tests/extension.test.ts` | Regression anchor for the toggle notifications |

---

## 5. SOURCE METADATA

- Group: Toggle And Notification
- Playbook ID: FAST-005
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `toggle-and-notification/toggle-cycles-state.md`
