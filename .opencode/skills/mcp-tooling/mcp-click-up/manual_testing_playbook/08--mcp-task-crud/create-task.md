---
title: "MCP-H001 -- Create Task via MCP"
description: "This scenario validates Create Task via MCP for `MCP-H001`. Objective: Verify `clickup_create_task` creates a task in LIST_ID and returns a task_id."
version: 1.0.0.5
---

# MCP-H001 -- Create Task via MCP

---

## 1. OVERVIEW

Validates that **Create Task via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_create_task` creates a task in LIST_ID and returns a task_id is required for correct agent operation. Failure here means `id` missing from response or task not found via cupt.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_task` creates a task in LIST_ID and returns a task_id
- **Real user request:** `Create a test task via MCP.`
- **Prompt:** `Create a task named 'MCP Playbook Test Task' in list LIST_ID.`
- **Expected signals:** MCP response includes `id`; `cupt show` confirms name; exit 0.
- **Desired user-visible outcome:** Agent reports: task 'MCP Playbook Test Task' created with ID TASK_ID.
- **Pass/fail:** PASS if response includes `id` AND task visible via cupt show; FAIL if `id` missing from response OR task not found via cupt

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list.
1. Code Mode: `clickup.clickup_create_task({list_id: 'LIST_ID', name: 'MCP Playbook Test Task', priority: 3})`
2. Verify response includes `id` field
3. `cupt show TASK_ID --json | jq .name`  # → 'MCP Playbook Test Task'

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-H001 | Create Task via MCP | Verify `clickup_create_task` creates a task in LIST_ID  | `Create a task named 'MCP Playbook Test Task' in list LI` | MCP response includes `id`; `cupt show` confirms name; exit 0. | PASS if response includes `id` AND task visible via cupt show; FAIL if `id` missing from response OR task not found via cupt | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/11--mcp-high-priority/create-task.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--mcp-task-crud/create-task.md`
