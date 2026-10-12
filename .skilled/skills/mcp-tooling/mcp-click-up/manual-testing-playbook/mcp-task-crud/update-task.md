---
title: "MCP-H003 -- Update Task via MCP"
description: "This scenario validates Update Task via MCP for `MCP-H003`. Objective: Verify `clickup_update_task` changes the test task's status to a valid value."
version: 1.1.0.0
---

# MCP-H003 -- Update Task via MCP

---

## 1. OVERVIEW

Validates that **Update Task via MCP** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_update_task` changes the test task's status to a valid value. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_update_task` changes the test task's status to a valid value
- **Real user request:** `Move the test task to in progress via MCP.`
- **Prompt:** `Update task TASK_ID status to 'in progress'.`
- **Expected signals:** The status exists in `available_statuses`; the update returns no `error` field; cupt shows the new status.
- **Desired user-visible outcome:** Agent reports the task moved to 'in progress'.
- **Pass/fail:** PASS if cupt shows the new status; FAIL if the update returns an `error` field OR the status is unchanged

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID', expand_statuses: true})` and pick a status from `available_statuses`
2. Code Mode: `clickup_official.clickup_official_clickup_update_task({task_id: 'TASK_ID', status: 'in progress'})`
3. `cupt show TASK_ID --json | jq .status`  # → the new status

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H003 | Update Task via MCP | Verify `clickup_update_task` changes the test task's status to a valid value | `Update task TASK_ID status to 'in progress'.` | 1. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID', expand_statuses: true})` and pick a status from `available_statuses` 2. Code Mode: `clickup_official.clickup_official_clickup_update_task({task_id: 'TASK_ID', status: 'in progress'})` 3. `cupt show TASK_ID --json \| jq .status`  # → the new status | The status exists in `available_statuses`; the update returns no `error` field; cupt shows the new status. | Code Mode logs plus the terminal output of any cupt step | PASS if cupt shows the new status; FAIL if the update returns an `error` field OR the status is unchanged | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/update-task.md`](../../feature-catalog/mcp-high-priority/update-task.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/update-task.md`
