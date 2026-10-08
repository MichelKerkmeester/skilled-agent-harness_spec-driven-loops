---
title: "clickup_remove_task_from_list"
description: "Remove a task from an additional list. The home list cannot be removed."
trigger_phrases:
  - "clickup_remove_task_from_list"
  - "remove task from list"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_remove_task_from_list

Remove a task from an additional list. The home list cannot be removed.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_remove_task_from_list` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Remove a task from an additional list (cannot remove from home list). Requires the Tasks in Multiple Lists ClickApp to be enabled.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the task to remove from the additional list. Works with regular and custom IDs (like 'DEV-1234'). Note: a task cannot be removed from its home list. |
| `list_id` | string | yes | ID of the additional list to remove the task from. Use clickup_get_list to find the list ID from a list name if needed. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Needs the Tasks in Multiple Lists ClickApp.

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
- Feature file path: `mcp-medium-priority/remove-task-from-list.md`

Related references:
- [add-task-to-list.md](../../feature-catalog/mcp-medium-priority/add-task-to-list.md): clickup_add_task_to_list
