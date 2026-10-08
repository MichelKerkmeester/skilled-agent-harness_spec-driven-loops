---
title: "MCP-H001 -- Create Task via MCP"
description: "This scenario validates Create Task via MCP for `MCP-H001`. Objective: Verify `clickup_create_task` creates a task in LIST_ID and returns its ID."
version: 1.1.0.0
---

# MCP-H001 -- Create Task via MCP

---

## 1. OVERVIEW

Validates that **Create Task via MCP** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_create_task` creates a task in LIST_ID and returns its ID. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_task` creates a task in LIST_ID and returns its ID
- **Real user request:** `Create a test task via MCP.`
- **Prompt:** `Create a task named 'MCP Playbook Test Task' in list LIST_ID.`
- **Expected signals:** Response carries a task ID and no `error` field; `cupt show` confirms the name.
- **Desired user-visible outcome:** Agent reports: task 'MCP Playbook Test Task' created with ID TASK_ID.
- **Pass/fail:** PASS if the response carries a task ID AND cupt shows the task; FAIL if the response has an `error` field OR cupt cannot find the task

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_create_task({list_id: 'LIST_ID', name: 'MCP Playbook Test Task', priority: 'normal'})`
2. Read the task ID from the logged response
3. `cupt show TASK_ID --json | jq .name`  # → 'MCP Playbook Test Task'

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H001 | Create Task via MCP | Verify `clickup_create_task` creates a task in LIST_ID and returns its ID | `Create a task named 'MCP Playbook Test Task' in list LIST_ID.` | 1. Code Mode: `clickup_official.clickup_official_clickup_create_task({list_id: 'LIST_ID', name: 'MCP Playbook Test Task', priority: 'normal'})` 2. Read the task ID from the logged response 3. `cupt show TASK_ID --json \| jq .name`  # → 'MCP Playbook Test Task' | Response carries a task ID and no `error` field; `cupt show` confirms the name. | Code Mode logs plus the terminal output of any cupt step | PASS if the response carries a task ID AND cupt shows the task; FAIL if the response has an `error` field OR cupt cannot find the task | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/create-task.md`](../../feature-catalog/mcp-high-priority/create-task.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/create-task.md`
