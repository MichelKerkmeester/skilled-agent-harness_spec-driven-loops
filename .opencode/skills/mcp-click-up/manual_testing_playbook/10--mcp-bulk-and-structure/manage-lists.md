---
title: "MCP-M007 -- Manage Lists via MCP"
description: "This scenario validates Manage Lists via MCP for `MCP-M007`. Objective: Verify `clickup_manage_lists` creates a list in SPACE_ID and returns a list_id."
version: 1.0.0.5
---

# MCP-M007 -- Manage Lists via MCP

---

## 1. OVERVIEW

Validates that **Manage Lists via MCP** behaves as defined in the feature catalog.

### Why This Matters

Verify `clickup_manage_lists` creates a list in SPACE_ID and returns a list_id is required for correct agent operation. Failure here means `id` missing or mcp error.

---

## 2. SCENARIO CONTRACT

- **Objective:** Verify `clickup_manage_lists` creates a list in SPACE_ID and returns a list_id
- **Real user request:** `Create a list via MCP.`
- **Prompt:** `Create a list named 'MCP Test List' in space SPACE_ID.`
- **Expected signals:** MCP returns list object with `id`; list visible in ClickUp; exit 0.
- **Desired user-visible outcome:** Agent reports: list 'MCP Test List' created with ID LIST_ID.
- **Pass/fail:** PASS if response includes `id` AND list visible in ClickUp; FAIL if `id` missing OR MCP error

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

PRE: Obtain a SPACE_ID from `clickup.clickup_get_workspace`.
1. Code Mode: `clickup.clickup_manage_lists({action: 'create', space_id: 'SPACE_ID', name: 'MCP Test List'})`
2. `bash: jq .id <<< "$RESULT"`  # → list_id
3. Confirm list visible in ClickUp

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Expected Signals | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|
| MCP-M007 | Manage Lists via MCP | Verify `clickup_manage_lists` creates a list in SPACE_I | `Create a list named 'MCP Test List' in space SPACE_ID.` | MCP returns list object with `id`; list visible in ClickUp; exit 0. | PASS if response includes `id` AND list visible in ClickUp; FAIL if `id` missing OR MCP error | See `../references/troubleshooting.md` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|------|------|
| `manual_testing_playbook.md` | Root directory and scenario summary |
| `../feature_catalog/12--mcp-medium-priority/manage-lists.md` | Feature catalog source |

### Implementation And Test Anchors

| File | Role |
|------|------|
| `../references/cupt_commands.md` | cupt command reference |
| `../references/troubleshooting.md` | Error diagnosis |

---

## 5. SOURCE METADATA

- Group: MCP Structure
- Playbook ID: MCP-M007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--mcp-bulk-and-structure/manage-lists.md`
