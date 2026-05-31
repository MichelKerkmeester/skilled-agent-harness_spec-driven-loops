---
title: "MCP-H002 -- Get Task via MCP"
description: "This scenario validates Get Task via MCP for `MCP-H002`. Objective: Verify `clickup_get_task` returns full task object for a known task ID."
---

# MCP-H002 -- Get Task via MCP

---

## 1. OVERVIEW

Validates that **Get Task via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_get_task` returns full task object for a known task ID is required for correct agent operation. Failure here means 404/not found or response missing required fields.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_get_task` returns full task object for a known task ID
- **Real user request:** `Get task details via MCP.`
- **Prompt:** `Get all fields for task TASK_ID using the MCP.`
- **Expected signals:** MCP returns JSON with `id`, `name`, `status`, `priority`, `assignees`, `tags`; exit 0.
- **Desired user-visible outcome:** Agent reports: task ID TASK_ID is named '...', status is '...', priority N.
- **Pass/fail:** PASS if response includes `id`, `name`, and `status` fields; FAIL if 404/not found OR response missing required fields

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Code Mode: `clickup.clickup_get_task({task_id: 'TASK_ID'})`
2. `bash: jq '.id, .name, .status.status' <<< "$RESULT"`  # → task ID, name, status

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-H002 | Get Task via MCP | Verify `clickup_get_task` returns full task object for  | `Get all fields for task TASK_ID using the MCP.` | MCP returns JSON with `id`, `name`, `status`, `priority`, `assignees`, `tags`; e | PASS if response includes `id`, `name`, and `status` fields; FAIL if 404/not found OR response missing required fields | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/11--mcp-high-priority/02-get-task.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--mcp-task-crud/002-get-task.md`
