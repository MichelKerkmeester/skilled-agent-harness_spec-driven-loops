---
title: "clickup_add_task_to_list"
description: "Show a task in an additional list while it keeps its home list."
trigger_phrases:
  - "clickup_add_task_to_list"
  - "add task to another list"
  - "tasks in multiple lists"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_add_task_to_list

Show a task in an additional list while it keeps its home list.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_add_task_to_list` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Add a task to an additional list (keeps current home list). Requires the Tasks in Multiple Lists ClickApp to be enabled.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the task to add. Works with regular and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
| `list_id` | string | yes | ID of the additional list to add the task to. The task remains in its original list. Use clickup_get_list to find the list ID from a list name if needed. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Needs the Tasks in Multiple Lists ClickApp. Use `clickup_move_task` to change the home list instead.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/add-task-to-list.md`

Related references:
- [remove-task-from-list.md](../../feature-catalog/mcp-medium-priority/remove-task-from-list.md): clickup_remove_task_from_list
- [move-task.md](../../feature-catalog/mcp-high-priority/move-task.md): clickup_move_task
