---
title: "CU-030 -- Log Time Manually"
description: "This scenario validates Log Time Manually for `CU-030`. Objective: Verify `cupt time add TASK_ID 1h30m` creates a time entry visible in ClickUp."
version: 1.0.0.6
---

# CU-030 -- Log Time Manually

---

## 1. OVERVIEW

Validates that **Log Time Manually** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt time add TASK_ID 1h30m` creates a time entry visible in ClickUp is required for correct agent operation. Failure here means exit non-zero or time entry missing from clickup.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt time add TASK_ID 1h30m` creates a time entry visible in ClickUp
- **Real user request:** `Log 1 hour 30 minutes on task TASK_ID.`
- **Prompt:** `Log 1h30m of work on task TASK_ID.`
- **Expected signals:** Step 1: confirmation message with duration logged; exit 0. Step 2: ClickUp shows 1h30m in time tracked.
- **Desired user-visible outcome:** Agent reports: 1h30m logged to task TASK_ID. Time tracked updated in ClickUp.
- **Pass/fail:** PASS if exit 0 AND time entry appears in ClickUp; FAIL if exit non-zero OR time entry missing from ClickUp

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt time add TASK_ID 1h30m`  # → exit 0 with confirmation
2. Open ClickUp UI and check Time Tracked on the task

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-030 | Log Time Manually | Verify `cupt time add TASK_ID 1h30m` creates a time entry visible in ClickUp | `Log 1h30m of work on task TASK_ID.` | 1. `cupt time add TASK_ID 1h30m`  # → exit 0 with confirmation 2. Open ClickUp UI and check Time Tracked on the task | Step 1: confirmation message with duration logged; exit 0. Step 2: ClickUp shows 1h30m in time tracked. | Terminal output of the command sequence above | PASS if exit 0 AND time entry appears in ClickUp; FAIL if exit non-zero OR time entry missing from ClickUp | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/06--cupt-time-tracking/log-manual.md`](../../feature_catalog/06--cupt-time-tracking/log-manual.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Time Tracking
- Playbook ID: CU-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--time-and-notes/time-add-manual.md`
