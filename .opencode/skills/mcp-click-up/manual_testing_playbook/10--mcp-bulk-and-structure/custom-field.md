---
title: "MCP-L019 -- Set Custom Field Value via MCP"
description: "This scenario validates Set Custom Field Value via MCP for `MCP-L019`. Objective: Verify `clickup_set_custom_field_value` sets a field value readable back via get."
---

# MCP-L019 -- Set Custom Field Value via MCP

---

## 1. OVERVIEW

Validates that **Set Custom Field Value via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_set_custom_field_value` sets a field value readable back via get_task is required for correct agent operation. Failure here means field value unchanged or custom field not found in task.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_set_custom_field_value` sets a field value readable back via get_task
- **Real user request:** `Set a custom field on a task via MCP.`
- **Prompt:** `Set custom field FIELD_ID to value 'playbook-test' on task TASK_ID.`
- **Expected signals:** Step 2: set exits 0. Step 4: field value is 'playbook-test'.
- **Desired user-visible outcome:** Agent reports: custom field FIELD_ID set to 'playbook-test' on task TASK_ID.
- **Pass/fail:** PASS if step 4 returns 'playbook-test'; FAIL if field value unchanged OR custom field not found in task

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: A text-type custom field must exist on the task's list (discover FIELD_ID via `clickup_get_custom_fields`).
1. Code Mode: `clickup.clickup_get_custom_fields({list_id: 'LIST_ID'})`  # → find text field ID
2. Code Mode: `clickup.clickup_set_custom_field_value({task_id: 'TASK_ID', field_id: 'FIELD_ID', value: 'playbook-test'})`
3. Code Mode: `clickup.clickup_get_task({task_id: 'TASK_ID'})`  # → check custom_fields
4. `bash: jq '.custom_fields[] | select(.id=="FIELD_ID") | .value' <<< "$RESULT"`  # → 'playbook-test'

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-L019 | Set Custom Field Value via MCP | Verify `clickup_set_custom_field_value` sets a field va | `Set custom field FIELD_ID to value 'playbook-test' on t` | Step 2: set exits 0. Step 4: field value is 'playbook-test'. | PASS if step 4 returns 'playbook-test'; FAIL if field value unchanged OR custom field not found in task | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/13--mcp-low-priority/set-custom-field.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Custom Fields
- Playbook ID: MCP-L019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--mcp-bulk-and-structure/custom-field.md`
