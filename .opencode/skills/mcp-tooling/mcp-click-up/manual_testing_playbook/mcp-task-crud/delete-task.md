---
title: "MCP-H004 -- Delete Task via MCP (DESTRUCTIVE)"
description: "This scenario validates Delete Task via MCP (DESTRUCTIVE) for `MCP-H004`. Objective: Verify `clickup_delete_task` removes the task and subsequent get returns not-fou."
version: 1.0.0.5
---

# MCP-H004 -- Delete Task via MCP (DESTRUCTIVE)

---

## 1. OVERVIEW

Validates that **Delete Task via MCP (DESTRUCTIVE)** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_delete_task` removes the task and subsequent get returns not-found is required for correct agent operation. Failure here means task still accessible after deletion attempt.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_delete_task` removes the task and subsequent get returns not-found
- **Real user request:** `Delete test task via MCP.`
- **Prompt:** `Delete task TASK_ID permanently via MCP.`
- **Expected signals:** Step 1: MCP returns success. Step 2: task returns 404 or not-found error.
- **Desired user-visible outcome:** Agent reports: task deleted. Subsequent fetch confirms task no longer exists.
- **Pass/fail:** PASS if step 2 returns not-found error confirming deletion; FAIL if task still accessible after deletion attempt

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: TASK_ID must be the throwaway test task created in MCP-H001.
1. Code Mode: `clickup.clickup_delete_task({task_id: 'TASK_ID'})`
2. Code Mode: `clickup.clickup_get_task({task_id: 'TASK_ID'})`  # → should return 404/not-found

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-H004 | Delete Task via MCP (DESTRUCTIVE) | Verify `clickup_delete_task` removes the task and subse | `Delete task TASK_ID permanently via MCP.` | Step 1: MCP returns success. Step 2: task returns 404 or not-found error. | PASS if step 2 returns not-found error confirming deletion; FAIL if task still accessible after deletion attempt | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/mcp-high-priority/delete-task.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-task-crud/delete-task.md`
