---
title: "CACHE-003 -- Footer mode config persists"
description: "This scenario validates footer-mode configuration for `CACHE-003`. It focuses on confirming that /cache-optimizer config footer-mode session sets and confirms the mode."
stage: routing
version: 1.0.0.0
---

# CACHE-003 -- Footer mode config persists

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CACHE-003`.

---

## 1. OVERVIEW

This scenario validates footer-mode configuration for `CACHE-003`. It focuses on confirming that `/cache-optimizer config footer-mode session` persists the footer stats mode and confirms it.

### Why This Matters

The footer mode controls how cache stats are summarized. Persisting it and confirming the change lets an operator trust that their display choice took effect.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CACHE-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm the footer mode is set and confirmed.
- Real user request: `Show cache stats per session instead of the daily total.`
- Prompt: `/cache-optimizer config footer-mode session`
- Expected execution process: run the config command in a loaded Pi session and read the notification.
- Expected signals: a notification reading `✅ Footer mode set to session`.
- Desired user-visible outcome: the operator sees their footer mode confirmed.
- Pass/fail: PASS if the notification confirms `Footer mode set to session`; FAIL if it is missing or reports a different mode.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: set the footer mode to session.
2. Keep the scenario local to one live Pi session.
3. Run the command exactly as written.
4. Compare the notification against the desired outcome.
5. Record the notification text.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CACHE-003 | Footer mode config persists | Verify footer mode is set and confirmed | `/cache-optimizer config footer-mode session` | 1. `bash: pi` -> 2. `pi> /cache-optimizer config footer-mode session` | Step 2: notification reads `✅ Footer mode set to session` | Notification text | PASS if the notification confirms `Footer mode set to session`; FAIL if missing or a different mode | 1. Confirm the extension is loaded. 2. Retry with `total` and `process` to confirm each mode is accepted. 3. Confirm the agent directory is writable so the mode can persist. |

### Optional Supplemental Checks

Run `/cache-optimizer config footer-mode total` and confirm it switches back.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../index.ts` | `/cache-optimizer config footer-mode` handler and persistence |
| `../../tests/hook-guards.test.ts` | Regression anchor for command registration |

---

## 5. SOURCE METADATA

- Group: Command Surface
- Playbook ID: CACHE-003
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `command-surface/footer-mode-config-persists.md`
