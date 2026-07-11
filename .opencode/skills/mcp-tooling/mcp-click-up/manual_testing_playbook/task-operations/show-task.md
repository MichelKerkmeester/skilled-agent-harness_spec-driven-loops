---
title: "CU-017 -- Show Task — cupt show --json"
description: "This scenario validates Show Task — cupt show --json for `CU-017`. Objective: Verify `cupt show TASK_ID --json` returns a complete task object."
version: 1.0.0.6
---

# CU-017 -- Show Task — cupt show --json

---

## 1. OVERVIEW

Validates that **Show Task — cupt show --json** behaves as defined in the feature catalog.

### Why This Matters

Verify `cupt show TASK_ID --json` returns a complete task object is required for correct agent operation. Failure here means non-json output or `id` field missing or exit non-zero.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `cupt show TASK_ID --json` returns a complete task object
- **Real user request:** `Show all details for task TASK_ID.`
- **Prompt:** `Show task TASK_ID details in JSON format.`
- **Expected signals:** JSON object with `id`, `name`, `status`, `assignees` fields; exit 0
- **Desired user-visible outcome:** Agent reports task name, current status, assignees, and due date.
- **Pass/fail:** PASS if JSON object returned with `id` field matching TASK_ID; FAIL if non-JSON output OR `id` field missing OR exit non-zero

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. `cupt show TASK_ID --json`  # → JSON object
2. `bash: echo $RESULT | jq .id`  # → quoted task ID
3. `bash: echo $RESULT | jq .status.status`  # → status string

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-017 | Show Task — cupt show --json | Verify `cupt show TASK_ID --json` returns a complete task object | `Show task TASK_ID details in JSON format.` | 1. `cupt show TASK_ID --json`  # → JSON object 2. `bash: echo $RESULT \| jq .id`  # → quoted task ID 3. `bash: echo $RESULT \| jq .status.status`  # → status string | JSON object with `id`, `name`, `status`, `assignees` fields; exit 0 | Terminal output of the command sequence above | PASS if JSON object returned with `id` field matching TASK_ID; FAIL if non-JSON output OR `id` field missing OR exit non-zero | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/cupt-task-details/show-task.md`](../../feature_catalog/cupt-task-details/show-task.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: cupt Task Details
- Playbook ID: CU-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `task-operations/show-task.md`
