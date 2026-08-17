---
title: "CACHE-004 -- Invalid footer mode shows usage"
description: "This scenario validates footer-mode argument validation for `CACHE-004`. It focuses on confirming that an unrecognized mode prints usage without changing state."
stage: negative
version: 1.0.0.0
---

# CACHE-004 -- Invalid footer mode shows usage

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-004`.

---

## 1. OVERVIEW

This scenario validates footer-mode argument validation for `CACHE-004`. It focuses on confirming that an unrecognized mode such as `bogus` prints the usage string and does not change the persisted mode.

### Why This Matters

An operator will eventually mistype the mode. Catching it with a usage message, and not silently persisting a bad value, keeps the footer configuration predictable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm an invalid mode prints usage and does not change state.
- Real user request: `Set footer mode to bogus.`
- Prompt: `/cache-optimizer config footer-mode bogus`
- Expected execution process: run the invalid command in a loaded Pi session and read the notification.
- Expected signals: a notification starting `Usage: /cache-optimizer config footer-mode total|session|process`.
- Desired user-visible outcome: the typo is caught with a helpful usage message.
- Pass/fail: PASS if the notification starts with that usage line and the persisted mode is unchanged; FAIL if the mode changes or no usage line appears.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: run an unsupported footer mode.
2. Keep the scenario local to one live Pi session.
3. Run the invalid command exactly as written.
4. Confirm the usage message and that the mode did not change.
5. Record the notification text.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-004 | Invalid footer mode shows usage | Verify usage message with no state change | `/cache-optimizer config footer-mode bogus` | 1. `bash: pi` -> 2. `pi> /cache-optimizer config footer-mode bogus` | Step 2: notification starts `Usage: /cache-optimizer config footer-mode total|session|process` and the current mode is echoed unchanged | Notification text | PASS if the usage line appears and the mode is unchanged; FAIL if the mode changes or no usage line appears | 1. Confirm the extension is loaded. 2. Run `/cache-optimizer config footer-mode session` first, then the invalid command, and confirm the mode stays `session`. 3. Confirm the argument was exactly `bogus`. |

### Optional Supplemental Checks

Run `/cache-optimizer config footer-mode` with no mode and confirm the same usage message.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | `/cache-optimizer config` validation branch |
| `../../tests/hook-guards.test.ts` | Regression anchor for command registration |

---

## 5. SOURCE METADATA

- Group: Command Surface
- Playbook ID: CACHE-004
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `command-surface/invalid-footer-mode-usage.md`
