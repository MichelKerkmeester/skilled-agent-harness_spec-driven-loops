---
title: "MCP-H002 -- Get Task via MCP"
description: "This scenario validates Get Task via MCP for `MCP-H002`. Objective: Verify `clickup_get_task` returns the task created in MCP-H001."
version: 1.1.0.0
---

# MCP-H002 -- Get Task via MCP

---

## 1. OVERVIEW

Validates that **Get Task via MCP** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_get_task` returns the task created in MCP-H001. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_get_task` returns the task created in MCP-H001
- **Real user request:** `Show me the details of the test task via MCP.`
- **Prompt:** `Get all details for task TASK_ID, including its description.`
- **Expected signals:** Response carries the task ID, name and status, and no `error` field.
- **Desired user-visible outcome:** Agent reports the task's name, status and description.
- **Pass/fail:** PASS if ID, name and status are present; FAIL if the response has an `error` field

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID', include: ['description']})`
2. Check the response for the task's ID, name and status

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H002 | Get Task via MCP | Verify `clickup_get_task` returns the task created in MCP-H001 | `Get all details for task TASK_ID, including its description.` | 1. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID', include: ['description']})` 2. Check the response for the task's ID, name and status | Response carries the task ID, name and status, and no `error` field. | Code Mode logs plus the terminal output of any cupt step | PASS if ID, name and status are present; FAIL if the response has an `error` field | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/get-task.md`](../../feature-catalog/mcp-high-priority/get-task.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/get-task.md`
