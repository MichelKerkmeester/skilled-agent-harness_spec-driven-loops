---
title: "clickup_update_task"
description: "Change task fields: name, markdown description, status, priority, dates, assignees, type and custom fields."
trigger_phrases:
  - "clickup_update_task"
  - "update task"
  - "change task status mcp"
  - "set custom field"
  - "reassign task"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_task

Change task fields: name, markdown description, status, priority, dates, assignees, type and custom fields.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_update_task` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Update task properties. Requires task_id and at least one field to change. Supports assignees (user IDs, emails, usernames, or "me"), custom fields as [{id, value}], and task_type by name (or 'none' to reset).

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `name` | string | no | - |
| `markdown_description` | string | no | Task description in markdown format. |
| `status` | string | no | New status (must be valid for the task's list). |
| `priority` | string (`urgent`, `high`, `normal`, `low`, `none`) | no | Set priority, or 'none' to clear. Omit to leave unchanged. |
| `due_date` | string | no | YYYY-MM-DD or YYYY-MM-DD HH:MM format. Pass 'none' to clear. Omit to leave unchanged. |
| `start_date` | string | no | YYYY-MM-DD or YYYY-MM-DD HH:MM format. Pass 'none' to clear. Omit to leave unchanged. |
| `time_estimate` | string | no | Time estimate in minutes (e.g., '150' for 2h 30m). |
| `custom_fields` | array | no | Array of custom field values to set on the task. Each object must have an 'id' and 'value' property. |
| `assignees` | array | no | Array of assignee user IDs. Use clickup_resolve_assignees to convert emails, usernames, or "me" to user IDs if needed. |
| `task_type` | string | no | To change the task type, pass the type name as a string (e.g., 'Bug', 'Feature', 'Milestone'). The type must exist in the workspace. To revert to the default 'Task' type, pass 'none'. Omit entirely to leave unchanged. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass `task_id` and at least one field. Use `markdown_description` for markdown, since the server has no plain or `markdown_content` alternative. Custom field values go in `custom_fields` as `[{id, value}]`, which replaces the old single-field setter. Discover field IDs with `clickup_get_custom_fields` and valid statuses with `clickup_get_task` plus `expand_statuses`. To mark a task done, prefer `cupt done`, which resolves the closed status per list and has a dry run.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/update-task.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/update-task.md`

Related references:
- [get-task.md](../../feature-catalog/mcp-high-priority/get-task.md): clickup_get_task
- [get-custom-fields.md](../../feature-catalog/mcp-low-priority/get-custom-fields.md): clickup_get_custom_fields
