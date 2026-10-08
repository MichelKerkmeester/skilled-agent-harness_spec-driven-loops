---
title: "MCP-L019 -- Set a Custom Field Value"
description: "This scenario validates Set a Custom Field Value for `MCP-L019`. Objective: Verify a custom field value set through `clickup_update_task` reads back."
version: 1.1.0.0
---

# MCP-L019 -- Set a Custom Field Value

---

## 1. OVERVIEW

Validates that **Set a Custom Field Value** behaves as the feature catalog describes. Tool names and parameters come from the hosted server's schema, captured on 2026-10-08.

### Why This Matters

Verify a custom field value set through `clickup_update_task` reads back. A failure here means an agent following this skill gets a wrong answer or a tool-not-found error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify a custom field value set through `clickup_update_task` reads back
- **Real user request:** `Set a custom field on the test task via MCP.`
- **Prompt:** `Set custom field FIELD_ID on task TASK_ID to 'test-value'.`
- **Expected signals:** The read-back shows FIELD_ID with 'test-value'.
- **Desired user-visible outcome:** Agent reports the field set and shows the read-back.
- **Pass/fail:** PASS if the value reads back; FAIL if the update errors OR the value differs

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: MCP configured. Use a throwaway test list and task.
1. Code Mode: `clickup_official.clickup_official_clickup_get_custom_fields({list_id: 'LIST_ID'})` to find a text field's FIELD_ID
2. Code Mode: `clickup_official.clickup_official_clickup_update_task({task_id: 'TASK_ID', custom_fields: [{id: 'FIELD_ID', value: 'test-value'}]})`
3. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID', include: ['custom_fields']})`

Each Code Mode step runs inside an async function passed to `mcp__code_mode__call_tool_chain`, with the result printed through `console.log`.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-L019 | Set a Custom Field Value | Verify a custom field value set through `clickup_update_task` reads back | `Set custom field FIELD_ID on task TASK_ID to 'test-value'.` | 1. Code Mode: `clickup_official.clickup_official_clickup_get_custom_fields({list_id: 'LIST_ID'})` to find a text field's FIELD_ID 2. Code Mode: `clickup_official.clickup_official_clickup_update_task({task_id: 'TASK_ID', custom_fields: [{id: 'FIELD_ID', value: 'test-value'}]})` 3. Code Mode: `clickup_official.clickup_official_clickup_get_task({task_id: 'TASK_ID', include: ['custom_fields']})` | The read-back shows FIELD_ID with 'test-value'. | Code Mode logs plus the terminal output of any cupt step | PASS if the value reads back; FAIL if the update errors OR the value differs | See [`../../references/troubleshooting.md`](../../references/troubleshooting.md) |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| [`manual-testing-playbook.md`](../../manual-testing-playbook/manual-testing-playbook.md) | Root directory and scenario summary |
| [`../../feature-catalog/mcp-low-priority/get-custom-fields.md`](../../feature-catalog/mcp-low-priority/get-custom-fields.md) | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | MCP tool reference |
| [`../../references/troubleshooting.md`](../../references/troubleshooting.md) | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Structure
- Playbook ID: MCP-L019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mcp-structure/custom-field.md`
