---
title: "MCP-H004 -- Delete Task via MCP (DESTRUCTIVE)"
description: "This scenario validates Delete Task via MCP (DESTRUCTIVE) for `MCP-H004`. Objective: Verify `clickup_delete_task` removes the throwaway task from MCP-H001."
version: 1.1.0.0
---

# MCP-H004 -- Delete Task via MCP (DESTRUCTIVE)

---

## 1. OVERVIEW

Validates that **Delete Task via MCP (DESTRUCTIVE)** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_delete_task` removes the throwaway task from MCP-H001. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_delete_task` removes the throwaway task from MCP-H001
- **Real user request:** `Delete the test task via MCP.`
- **Prompt:** `Delete test task TASK_ID permanently.`
- **Expected signals:** Delete returns no `error` field; the follow-up read reports the task as not found.
- **Desired user-visible outcome:** Agent reports the test task deleted and confirms it is gone.
- **Pass/fail:** PASS if the follow-up read reports not found; FAIL if the task can still be read

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Run in Wave 6 against the throwaway task from MCP-H001 only.
1. Confirm with the operator that TASK_ID is the throwaway test task
2. Code Mode: `clickup_official.clickup_official_clickup_delete_task({task_id: 'TASK_ID'})`
3. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID'})`  # → not found

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H004 | Delete Task via MCP (DESTRUCTIVE) | Verify `clickup_delete_task` removes the throwaway task from MCP-H001 | `Delete test task TASK_ID permanently.` | 1. Confirm with the operator that TASK_ID is the throwaway test task 2. Code Mode: `clickup_official.clickup_official_clickup_delete_task({task_id: 'TASK_ID'})` 3. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID'})`  # → not found | Delete returns no `error` field; the follow-up read reports the task as not found. | Code Mode logs plus the terminal output of any cupt step | PASS if the follow-up read reports not found; FAIL if the task can still be read | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/delete-task.md`](../../feature-catalog/mcp-high-priority/delete-task.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/delete-task.md`
