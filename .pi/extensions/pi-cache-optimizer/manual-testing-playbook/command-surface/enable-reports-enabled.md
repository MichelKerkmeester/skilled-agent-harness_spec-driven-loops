---
title: "CACHE-001 -- Enable reports enabled"
description: "This scenario validates the enable command for `CACHE-001`. It focuses on confirming that /cache-optimizer enable turns the optimizer on and reports it at info severity."
stage: routing
version: 1.0.0.0
---

# CACHE-001 -- Enable reports enabled

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-001`.

---

## 1. OVERVIEW

This scenario validates the enable command for `CACHE-001`. It focuses on confirming that `/cache-optimizer enable` turns runtime optimization on for the current Pi process and reports it with an info notification.

### Why This Matters

Enable is the operator's main switch. If the confirmation is missing or wrong, the operator cannot tell whether optimization is active for the session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm enable turns the optimizer on and reports it.
- Real user request: `Turn the cache optimizer on for this session.`
- Prompt: `/cache-optimizer enable`
- Expected execution process: run the command in a loaded Pi session and read the notification.
- Expected signals: a notification beginning `✅ Pi Cache Optimizer enabled for this Pi process` at info severity.
- Desired user-visible outcome: a clear confirmation that the optimizer is on.
- Pass/fail: PASS if the notification begins with that text at info severity; FAIL if it is missing, wrong, or a different severity.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: enable the optimizer.
2. Keep the scenario local to one live Pi session.
3. Run the command exactly as written.
4. Compare the notification against the desired outcome.
5. Record the notification text and severity.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-001 | Enable reports enabled | Verify enable reports enabled | `/cache-optimizer enable` | 1. `bash: pi` -> 2. `pi> /cache-optimizer enable` | Step 2: notification begins `✅ Pi Cache Optimizer enabled for this Pi process` at info severity | Notification text and severity | PASS if the notification begins with that text at info severity; FAIL if missing, wrong, or a different severity | 1. Confirm the extension is loaded (`pi list` shows `extensions/pi-cache-optimizer`). 2. Run `/reload` and retry. 3. Confirm no prior `/cache-optimizer disable` left a conflicting state. |

### Optional Supplemental Checks

Run `/cache-optimizer disable` then `/cache-optimizer enable` again to confirm the toggle is stable.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | `/cache-optimizer` command handler that emits the enable notification |
| `../../tests/hook-guards.test.ts` | Regression anchor for command and hook registration |

---

## 5. SOURCE METADATA

- Group: Command Surface
- Playbook ID: CACHE-001
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `command-surface/enable-reports-enabled.md`
