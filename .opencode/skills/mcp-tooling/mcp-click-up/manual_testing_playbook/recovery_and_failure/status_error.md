---
title: "FAIL-003 -- Status Resolution Error"
description: "This scenario validates Status Resolution Error for `FAIL-003`. Objective: Verify cupt provides a clear error when a list has no closed status defined."
version: 1.0.0.6
---

# FAIL-003 -- Status Resolution Error

---

## 1. OVERVIEW

Validates that **Status Resolution Error** behaves as defined in the feature catalog.

### Why This Matters

Verify cupt provides a clear error when a list has no closed status defined is required for correct agent operation. Failure here means misleading error or silent failure or no guidance on how to fix.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify cupt provides a clear error when a list has no closed status defined
- **Real user request:** `Test status resolution failure for a list with unusual status config.`
- **Prompt:** `Show status schema for a list and handle the case where no closed status exists.`
- **Expected signals:** Step 1: status list shown. Step 3 (if no closed status): error message explaining no closed status found; exit non-zero.
- **Desired user-visible outcome:** Agent reports: status schema shown. If no closed status: error message directs to ClickUp list settings.
- **Pass/fail:** PASS if step 1 shows status list AND error message is clear when no closed status exists; FAIL if misleading error OR silent failure OR no guidance on how to fix

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt statuses TASK_ID`  # → list of statuses
2. Verify output shows whether a closed status exists
3. If no closed status: `cupt done TASK_ID --dry-run`  # → clear error message

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAIL-003 | Status Resolution Error | Verify cupt provides a clear error when a list has no closed status defined | `Show status schema for a list and handle the case where no closed status exists.` | 1. `cupt statuses TASK_ID`  # → list of statuses 2. Verify output shows whether a closed status exists 3. If no closed status: `cupt done TASK_ID --dry-run`  # → clear error message | Step 1: status list shown. Step 3 (if no closed status): error message explaining no closed status found; exit non-zero. | Terminal output of the command sequence above | PASS if step 1 shows status list AND error message is clear when no closed status exists; FAIL if misleading error OR silent failure OR no guidance on how to fix | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/cupt_task_details/status_schema.md`](../../feature_catalog/cupt_task_details/status_schema.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: Recovery
- Playbook ID: FAIL-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `recovery-and-failure/status-error.md`
