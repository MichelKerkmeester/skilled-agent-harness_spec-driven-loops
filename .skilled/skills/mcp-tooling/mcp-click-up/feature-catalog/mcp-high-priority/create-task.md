---
title: "clickup_create_task"
description: "Create one task in a list, with a markdown description, assignees, tags, dates and custom fields."
trigger_phrases:
  - "clickup_create_task"
  - "create task"
  - "new clickup task"
  - "add task to list"
  - "create subtask"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_task

Create one task in a list, with a markdown description, assignees, tags, dates and custom fields.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_task` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create a task in a ClickUp list. Requires name and list_id, always ask the user which list. Supports assignees (user IDs, emails, usernames, or "me") and task_type by name.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `name` | string | yes | Task name. Ask the user what they want to name the task. |
| `list_id` | string | yes | List ID. Use clickup_get_list to resolve names. |
| `markdown_description` | string | no | Task description in markdown format. |
| `status` | string | no | Override default status. Omit to use list defaults. |
| `priority` | string (`urgent`, `high`, `normal`, `low`) | no | - |
| `due_date` | string | no | Due date in YYYY-MM-DD or YYYY-MM-DD HH:MM format |
| `start_date` | string | no | Start date in YYYY-MM-DD or YYYY-MM-DD HH:MM format |
| `parent` | string | no | Parent task ID to create as subtask. |
| `tags` | array | no | Tag names (must already exist in the space). |
| `custom_fields` | array | no | Array of custom field values to set on the task. Each object must have an 'id' and 'value' property. |
| `check_required_custom_fields` | boolean | no | Flag to check if all required custom fields are set before saving the task. |
| `assignees` | array | no | Array of assignee user IDs. Use clickup_resolve_assignees to convert emails, usernames, or "me" to user IDs if needed. |
| `time_estimate` | string | no | Time estimate in minutes (e.g., '150' for 2h 30m). |
| `task_type` | string | no | Name of the task type (e.g., 'Bug', 'Feature', 'Milestone'). The type must exist in the workspace. If not specified, the default task type will be used. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

cupt has no create command, so task creation always goes through this tool. Ask the user which list the task belongs in. Put any markdown in `markdown_description`, because ClickUp renders it as rich text. `priority` is one of `urgent`, `high`, `normal` or `low`, and dates use `YYYY-MM-DD` or `YYYY-MM-DD HH:MM`. Pass `parent` to create a subtask, and `custom_fields` as `[{id, value}]` to set field values on create. Tags must already exist in the space. The server has no bulk-create tool, so create several tasks with one call each inside a single `call_tool_chain`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/create-task.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/create-task.md`

Related references:
- [update-task.md](../../feature-catalog/mcp-high-priority/update-task.md): clickup_update_task
- [get-list.md](../../feature-catalog/mcp-medium-priority/get-list.md): clickup_get_list
