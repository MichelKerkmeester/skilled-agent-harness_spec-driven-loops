---
title: "MCP-H005 -- Filter Tasks via MCP"
description: "This scenario validates Filter Tasks via MCP for `MCP-H005`. Objective: Verify `clickup_filter_tasks` lists the tasks in LIST_ID, including the test task."
version: 1.1.0.0
---

# MCP-H005 -- Filter Tasks via MCP

---

## 1. OVERVIEW

Validates that **Filter Tasks via MCP** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_filter_tasks` lists the tasks in LIST_ID, including the test task. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_filter_tasks` lists the tasks in LIST_ID, including the test task
- **Real user request:** `List the open tasks in the test list via MCP.`
- **Prompt:** `Show the open tasks in list LIST_ID.`
- **Expected signals:** Result lists tasks from LIST_ID including the test task; no `error` field.
- **Desired user-visible outcome:** Agent lists the open tasks in the test list.
- **Pass/fail:** PASS if the test task appears; FAIL if the response has an `error` field OR the test task is missing

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_filter_tasks({list_ids: ['LIST_ID'], include_closed: false})`
2. Check that the test task from MCP-H001 is in the result, and follow `has_more` if it is set

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H005 | Filter Tasks via MCP | Verify `clickup_filter_tasks` lists the tasks in LIST_ID, including the test task | `Show the open tasks in list LIST_ID.` | 1. Code Mode: `clickup_official.clickup_official_clickup_filter_tasks({list_ids: ['LIST_ID'], include_closed: false})` 2. Check that the test task from MCP-H001 is in the result, and follow `has_more` if it is set | Result lists tasks from LIST_ID including the test task; no `error` field. | Code Mode logs plus the terminal output of any cupt step | PASS if the test task appears; FAIL if the response has an `error` field OR the test task is missing | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/filter-tasks.md`](../../feature-catalog/mcp-high-priority/filter-tasks.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/filter-tasks.md`
