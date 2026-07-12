---
title: "MCP-H003 -- Update Task via MCP"
description: "This scenario validates Update Task via MCP for `MCP-H003`. Objective: Verify `clickup_update_task` changes a task field and the change is reflected in."
version: 1.0.0.5
---

# MCP-H003 -- Update Task via MCP

---

## 1. OVERVIEW

Validates that **Update Task via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_update_task` changes a task field and the change is reflected in ClickUp is required for correct agent operation. Failure here means priority unchanged after update or mcp returns error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_update_task` changes a task field and the change is reflected in ClickUp
- **Real user request:** `Update a task's priority via MCP.`
- **Prompt:** `Update task TASK_ID priority to 2 (high) via MCP.`
- **Expected signals:** Step 1: MCP returns updated task with priority 2. Step 2: cupt show confirms priority is 2/high.
- **Desired user-visible outcome:** Agent reports: task priority updated to 'high' (2).
- **Pass/fail:** PASS if cupt show confirms new priority value matches update; FAIL if priority unchanged after update OR MCP returns error

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup_official.clickup_official_clickup_update_task({task_id: 'TASK_ID', priority: 2})`
2. `cupt show TASK_ID --json | jq .priority.priority`  # → '2' or 'high'

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H003 | Update Task via MCP | Verify `clickup_update_task` changes a task field and the change is reflected in ClickUp | `Update task TASK_ID priority to 2 (high) via MCP.` | 1. Code Mode: `clickup_official.clickup_official_clickup_update_task({task_id: 'TASK_ID', priority: 2})` 2. `cupt show TASK_ID --json \| jq .priority.priority`  # → '2' or 'high' | Step 1: MCP returns updated task with priority 2. Step 2: cupt show confirms priority is 2/high. | Code Mode response + terminal output of the verification step(s) above | PASS if cupt show confirms new priority value matches update; FAIL if priority unchanged after update OR MCP returns error | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual_testing_playbook.md`](../manual_testing_playbook.md) | Root directory and scenario summary |
| [`../../feature_catalog/mcp_high_priority/update_task.md`](../../feature_catalog/mcp_high_priority/update_task.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | cupt command reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `mcp-task-crud/update-task.md`
