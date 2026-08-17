---
title: "CACHE-002 -- Disable reports disabled"
description: "This scenario validates the disable command for `CACHE-002`. It focuses on confirming that /cache-optimizer disable turns the optimizer off and reports it at warning severity."
stage: routing
version: 1.0.0.0
---

# CACHE-002 -- Disable reports disabled

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-002`.

---

## 1. OVERVIEW

This scenario validates the disable command for `CACHE-002`. It focuses on confirming that `/cache-optimizer disable` turns runtime optimization off for the current Pi process and reports it with a warning notification.

### Why This Matters

Disable lets an operator turn the optimizer off to compare cache behavior. The warning severity signals that optimization is no longer active, which matters when reading footer stats.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm disable turns the optimizer off and reports it.
- Real user request: `Turn the cache optimizer off so I can compare.`
- Prompt: `/cache-optimizer disable`
- Expected execution process: run the command in a loaded Pi session and read the notification.
- Expected signals: a notification beginning `⏸️ Pi Cache Optimizer disabled for this Pi process` at warning severity.
- Desired user-visible outcome: a clear confirmation that the optimizer is off.
- Pass/fail: PASS if the notification begins with that text at warning severity; FAIL if it is missing, wrong, or a different severity.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: disable the optimizer.
2. Keep the scenario local to one live Pi session.
3. Run the command exactly as written.
4. Compare the notification against the desired outcome.
5. Record the notification text and severity.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-002 | Disable reports disabled | Verify disable reports disabled | `/cache-optimizer disable` | 1. `bash: pi` -> 2. `pi> /cache-optimizer disable` | Step 2: notification begins `⏸️ Pi Cache Optimizer disabled for this Pi process` at warning severity | Notification text and severity | PASS if the notification begins with that text at warning severity; FAIL if missing, wrong, or a different severity | 1. Confirm the extension is loaded. 2. Confirm the session was enabled first, so disable has an effect to report. 3. Run `/reload` and retry. |

### Optional Supplemental Checks

Run `/cache-optimizer disable` twice and confirm the second still reports disabled.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | `/cache-optimizer` command handler that emits the disable notification |
| `../../tests/hook-guards.test.ts` | Regression anchor for command and hook registration |

---

## 5. SOURCE METADATA

- Group: Command Surface
- Playbook ID: CACHE-002
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `command-surface/disable-reports-disabled.md`
