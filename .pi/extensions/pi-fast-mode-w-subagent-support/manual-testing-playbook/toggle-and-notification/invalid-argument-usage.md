---
title: "FAST-007 -- Invalid argument shows usage"
description: "This scenario validates argument validation for `FAST-007`. It focuses on confirming that an unrecognized argument reports the usage string and leaves state unchanged."
stage: negative
version: 1.0.0.0
---

# FAST-007 -- Invalid argument shows usage

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FAST-007`.

---

## 1. OVERVIEW

This scenario validates argument validation for `FAST-007`. It focuses on confirming that a mistyped argument such as `status` returns the usage string as an error notification and does not change Fast Mode state.

### Why This Matters

An operator will eventually mistype the command. Catching the typo with a clear usage message, and not silently mutating state, keeps the mode predictable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FAST-007` and confirm the expected signals without contradictory evidence.

- Objective: confirm an invalid argument reports usage and leaves state unchanged.
- Real user request: `Show me the fast mode status.`
- Prompt: `/fast status`
- Expected execution process: on a LUNA session set to a known disabled state, run `/fast status`.
- Expected signals: an error notification `Usage: /fast [on|off|toggle]` and no state change.
- Desired user-visible outcome: the typo is caught with a helpful message and no surprise state change.
- Pass/fail: PASS if the error notification is exactly `Usage: /fast [on|off|toggle]` and state stays disabled; FAIL if state changes or no usage message appears.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: run an unsupported argument.
2. Start from a known disabled state on a LUNA session.
3. Run `/fast status`.
4. Confirm the usage error and that state did not change.
5. Record the notification text and the pre and post state.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAST-007 | Invalid argument shows usage | Verify usage error with no state change | `/fast status` | 1. `bash: pi --model openai-codex/gpt-5.6-luna` -> 2. `pi> /fast off` -> 3. `pi> /fast status` | Step 2: state disabled; Step 3: error notification `Usage: /fast [on|off|toggle]` and state stays disabled | The notification text and the state before and after | PASS if the notification is exactly `Usage: /fast [on|off|toggle]` and state stays disabled; FAIL if state changes or no usage message appears | 1. Confirm the pre-state was disabled after Step 2. 2. Read `.pi/pi-fast-mode-w-subagent-support-config.json` after Step 3 and confirm `enabled` is still `false`. 3. Confirm the notification level is `error`, not `info`. |

### Optional Supplemental Checks

Repeat with another invalid argument such as `/fast enable` and confirm the same usage error, proving the guard is not specific to one token.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../src/commands.ts` | Argument parsing and usage error |
| `../../src/index.ts` | Error notification path |
| `../../tests/extension.test.ts` | Regression anchor for the invalid-argument notification |

---

## 5. SOURCE METADATA

- Group: Toggle And Notification
- Playbook ID: FAST-007
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `toggle-and-notification/invalid-argument-usage.md`
