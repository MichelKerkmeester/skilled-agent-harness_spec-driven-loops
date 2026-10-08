---
title: "clickup_delete_task"
description: "Delete a task permanently."
trigger_phrases:
  - "clickup_delete_task"
  - "delete task"
  - "remove task mcp"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_delete_task

Delete a task permanently.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_delete_task` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Delete a task by task_id (supports custom IDs like 'DEV-1234'). Always confirm the task_id with the user before deleting.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID to delete (supports custom IDs like 'DEV-1234') |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

This cannot be undone from the MCP. Confirm the task ID with the user before the call, and use it only on throwaway or confirmed duplicate tasks.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/delete-task.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/delete-task.md`

Related references:
- [get-task.md](../../feature-catalog/mcp-high-priority/get-task.md): clickup_get_task
