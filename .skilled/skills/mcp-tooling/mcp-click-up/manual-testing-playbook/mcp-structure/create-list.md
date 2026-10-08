---
title: "MCP-M007 -- Create a List"
description: "This scenario validates Create a List for `MCP-M007`. Objective: Verify `clickup_create_list` creates a list in SPACE_ID."
version: 1.1.0.0
---

# MCP-M007 -- Create a List

---

## 1. OVERVIEW

Validates that **Create a List** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify `clickup_create_list` creates a list in SPACE_ID. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_create_list` creates a list in SPACE_ID
- **Real user request:** `Create a test list via MCP.`
- **Prompt:** `Create a list named 'MCP Playbook Test List' in space SPACE_ID.`
- **Expected signals:** The list is created and resolves by name; no `error` field.
- **Desired user-visible outcome:** Agent reports the list created with its ID. The server has no delete-list tool, so the operator removes the list in the ClickUp UI afterwards.
- **Pass/fail:** PASS if the list resolves by name; FAIL if either call errors

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_get_workspace_hierarchy({max_depth: 1})` to find SPACE_ID
2. Code Mode: `clickup_official.clickup_official_clickup_create_list({name: 'MCP Playbook Test List', space_id: 'SPACE_ID'})`
3. Code Mode: `clickup_official.clickup_official_clickup_get_list({list_name: 'MCP Playbook Test List'})`  # → resolves to the new list

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-M007 | Create a List | Verify `clickup_create_list` creates a list in SPACE_ID | `Create a list named 'MCP Playbook Test List' in space SPACE_ID.` | 1. Code Mode: `clickup_official.clickup_official_clickup_get_workspace_hierarchy({max_depth: 1})` to find SPACE_ID 2. Code Mode: `clickup_official.clickup_official_clickup_create_list({name: 'MCP Playbook Test List', space_id: 'SPACE_ID'})` 3. Code Mode: `clickup_official.clickup_official_clickup_get_list({list_name: 'MCP Playbook Test List'})`  # → resolves to the new list | The list is created and resolves by name; no `error` field. | Code Mode logs plus the terminal output of any cupt step | PASS if the list resolves by name; FAIL if either call errors | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-medium-priority/create-list.md`](../../feature-catalog/mcp-medium-priority/create-list.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Structure
- Playbook ID: MCP-M007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-structure/create-list.md`
