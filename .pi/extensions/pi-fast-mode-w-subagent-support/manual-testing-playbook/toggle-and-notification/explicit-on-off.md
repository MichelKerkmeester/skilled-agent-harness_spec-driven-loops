---
title: "FAST-006 -- Explicit on then off"
description: "This scenario validates the explicit on and off commands for `FAST-006`. It focuses on confirming that `/fast on` then `/fast off` report enabled then disabled."
stage: routing
version: 1.0.0.0
---

# FAST-006 -- Explicit on then off

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-006`.

---

## 1. OVERVIEW

This scenario validates the explicit on and off commands for `FAST-006`. It focuses on confirming that `/fast on` reports `Fast Mode enabled` and `/fast off` reports `Fast Mode disabled`, with the indicator following.

### Why This Matters

Operators who prefer explicit commands over the bare toggle need the same reliable confirmation. The explicit forms must map exactly to their state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-006` and confirm the expected signals without contradictory evidence.

- Objective: confirm the explicit on and off forms report the correct state.
- Real user request: `Turn fast mode on. Actually, turn it back off.`
- Prompt: `/fast on` then `/fast off`
- Expected execution process: on a LUNA session, run `/fast on` then `/fast off`.
- Expected signals: `/fast on` shows `Fast Mode enabled` and the indicator appears; `/fast off` shows `Fast Mode disabled` and the indicator disappears.
- Desired user-visible outcome: explicit commands produce explicit, correct confirmations.
- Pass/fail: PASS if `/fast on` shows `Fast Mode enabled` with the indicator and `/fast off` shows `Fast Mode disabled` without it; FAIL if either notification is missing or wrong, or the indicator does not follow.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: turn Fast Mode on then off with explicit commands.
2. Keep the scenario local to one live LUNA session.
3. Run the two explicit commands in order.
4. Confirm each notification and the indicator.
5. Record both notification lines.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-006 | Explicit on then off | Verify explicit on and off report state | `/fast on` then `/fast off` | 1. `bash: pi --model openai-codex/gpt-5.6-luna` -> 2. `pi> /fast on` -> 3. `pi> /fast off` | Step 2: `Fast Mode enabled` and indicator appears; Step 3: `Fast Mode disabled` and indicator disappears | The ordered pair of notification lines and indicator visibility | PASS if Step 2 shows `Fast Mode enabled` with the indicator and Step 3 shows `Fast Mode disabled` without it; FAIL if either is missing, wrong, or the indicator does not follow | 1. Confirm the active model is `openai-codex/gpt-5.6-luna`. 2. Read `.pi/pi-fast-mode-w-subagent-support-config.json` after each command and confirm `enabled` matches. 3. If `/fast off` still shows the indicator, confirm the model did not change mid-session. |

### Optional Supplemental Checks

Run `/fast on` twice in a row and confirm the second still reports `Fast Mode enabled`, proving the command is idempotent.

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
| `../../src/commands.ts` | Argument parsing for on and off |
| `../../tests/extension.test.ts` | Regression anchor for the explicit-command notifications |

---

## 5. SOURCE METADATA

- Group: Toggle And Notification
- Playbook ID: FAST-006
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `toggle-and-notification/explicit-on-off.md`
