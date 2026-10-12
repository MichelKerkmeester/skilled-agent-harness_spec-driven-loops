---
title: "MCP-H009 -- Search the Workspace via MCP"
description: "This scenario validates Search the Workspace via MCP for `MCP-H009`. Objective: Verify `clickup_search` finds the test task by keyword."
version: 1.0.0.0
---

# MCP-H009 -- Search the Workspace via MCP

---

## 1. OVERVIEW

Validates that **Search the Workspace via MCP** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_search` finds the test task by keyword. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_search` finds the test task by keyword
- **Real user request:** `Find the playbook test task by searching ClickUp.`
- **Prompt:** `Search ClickUp for 'MCP Playbook Test Task'.`
- **Expected signals:** Results include the test task; no `error` field.
- **Desired user-visible outcome:** Agent reports the search hit and its ID.
- **Pass/fail:** PASS if the test task is found; FAIL if the response has an `error` field OR the task is missing

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_search({keywords: 'MCP Playbook Test Task', count: 10})`
2. Check that the test task is among the results

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-H009 | Search the Workspace via MCP | Verify `clickup_search` finds the test task by keyword | `Search ClickUp for 'MCP Playbook Test Task'.` | 1. Code Mode: `clickup_official.clickup_official_clickup_search({keywords: 'MCP Playbook Test Task', count: 10})` 2. Check that the test task is among the results | Results include the test task; no `error` field. | Code Mode logs plus the terminal output of any cupt step | PASS if the test task is found; FAIL if the response has an `error` field OR the task is missing | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-high-priority/search.md`](../../feature-catalog/mcp-high-priority/search.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Task CRUD
- Playbook ID: MCP-H009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-task-crud/search.md`
