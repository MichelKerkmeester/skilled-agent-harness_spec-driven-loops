---
title: "clickup_get_task"
description: "Read one task by ID, including custom IDs such as `DEV-1234`."
trigger_phrases:
  - "clickup_get_task"
  - "get task"
  - "task details mcp"
  - "read task"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_task

Read one task by ID, including custom IDs such as `DEV-1234`.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_task` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Retrieve a ClickUp task by ID (supports custom IDs like 'DEV-1234'). Returns a compact summary by default, core fields are always included, large sections appear as counts only (e.g. custom_fields_count: 3). Use include to fetch full data for specific sections: include: ["custom_fields", "description"]. Set expand_statuses=true to list valid statuses for update_task. URL disambiguation: a bare /t/<id> or /t/<workspace>/<id> ClickUp URL is a task, but in chat thread URLs (/v/cn/<channel_id>/t/<id> or /chat/r/<channel_id>/t/<id>) the trailing id is a chat MESSAGE id, use clickup_get_chat_message_replies for those.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `include` | array | no | Sections to return in full. Without this, large sections appear as counts (e.g. custom_fields_count: 3). Available: attachments (metadata only, id, title, extension, mimetype, size, date, source; use clickup_download_task_attachment to get a download URL), checklists (items + completion), custom_fields (field values), dependencies (blocking/waiting-on relationships), description (full text, summary truncates at 10k chars), linked_tasks (linked task IDs), subtasks (triggers subtask fetch from API), watchers (watching users). |
| `expand_statuses` | boolean | no | When true, returns the full set of statuses configured on the task's list (including any inherited from the parent folder or space) under `available_statuses`. Use to discover which status values can be assigned via update_task. Off by default to keep responses lean. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

The default response is a compact summary, and large sections appear only as counts. Ask for sections in full with `include`, for example `["description", "custom_fields", "checklists", "dependencies"]`. This is the only way to read checklists, which no tool on the server can edit, and dependencies, which `clickup_add_task_dependency` and `clickup_remove_task_dependency` edit. Set `expand_statuses: true` to see which statuses `clickup_update_task` can set. For daily reads, `cupt show <id> --json` is quicker.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/get-task.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/get-task.md`

Related references:
- [update-task.md](../../feature-catalog/mcp-high-priority/update-task.md): clickup_update_task
- [download-task-attachment.md](../../feature-catalog/mcp-low-priority/download-task-attachment.md): clickup_download_task_attachment
