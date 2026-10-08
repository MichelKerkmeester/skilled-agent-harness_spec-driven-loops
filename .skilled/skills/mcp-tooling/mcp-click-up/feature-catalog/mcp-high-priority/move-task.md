---
title: "clickup_move_task"
description: "Move a task to a different home list."
trigger_phrases:
  - "clickup_move_task"
  - "move task"
  - "change task list"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_move_task

Move a task to a different home list.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_move_task` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Move a task to a new home list. Requires task_id and list_id (supports custom IDs). Use clickup_get_list to resolve list names.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the task to move. Works with regular and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
| `list_id` | string | yes | ID of the destination list to move the task into. Use clickup_get_list to find the list ID from a list name if needed. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass `task_id` and the destination `list_id`. Resolve a list name with `clickup_get_list`. To keep the home list and also show the task elsewhere, use `clickup_add_task_to_list`.

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

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/move-task.md`

Related references:
- [add-task-to-list.md](../../feature-catalog/mcp-medium-priority/add-task-to-list.md): clickup_add_task_to_list
- [get-list.md](../../feature-catalog/mcp-medium-priority/get-list.md): clickup_get_list
