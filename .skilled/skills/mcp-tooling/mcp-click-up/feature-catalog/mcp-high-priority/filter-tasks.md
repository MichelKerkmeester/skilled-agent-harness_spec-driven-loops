---
title: "clickup_filter_tasks"
description: "List tasks that match field filters: tags, lists, folders, spaces, statuses, assignees, dates and custom fields."
trigger_phrases:
  - "clickup_filter_tasks"
  - "filter tasks"
  - "tasks in list"
  - "tasks by status"
  - "tasks due between"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_filter_tasks

List tasks that match field filters: tags, lists, folders, spaces, statuses, assignees, dates and custom fields.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_filter_tasks` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Retrieve tasks with combined filters (tags, lists, folders, spaces, statuses, assignees, due date range, completion date range, custom field values). Multiple values within a filter use OR logic; across filters, AND logic applies (custom_fields entries also AND together). Best for filtering tasks by structured field values. For text/keyword search across all workspace content, use search instead. Custom field filters need field IDs, discover them with clickup_get_custom_fields. Results are paginated at 100 tasks per page: the response includes has_more and next_page, and when has_more is true you MUST call again with page set to next_page (repeating until has_more is false) to retrieve every matching task, a single call is not guaranteed to be complete. Assignees must be numeric user IDs, use clickup_resolve_assignees to convert names/emails/"me". Date filters use YYYY-MM-DD. For a single task by ID, use clickup_get_task.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `tags` | array | no | Filter by tag names. Multiple tags use OR logic (matches tasks with ANY of the specified tags). |
| `list_ids` | array | no | Filter by List IDs. Multiple IDs use OR logic (matches tasks in ANY of the specified lists). |
| `folder_ids` | array | no | Filter by Folder IDs. Multiple IDs use OR logic (matches tasks in ANY of the specified folders). |
| `space_ids` | array | no | Filter by Space IDs. Multiple IDs use OR logic (matches tasks in ANY of the specified spaces). |
| `statuses` | array | no | Filter by task status names. Multiple statuses use OR logic (matches tasks with ANY of the specified statuses). |
| `assignees` | array | no | Filter by assignee user IDs. Multiple IDs use OR logic. Use clickup_resolve_assignees to convert names/emails/"me" first. |
| `include_closed` | boolean | no | Include closed tasks in results |
| `due_date_from` | string | no | Filter tasks with due date on or after. Format: YYYY-MM-DD |
| `due_date_to` | string | no | Filter tasks with due date on or before. Format: YYYY-MM-DD |
| `date_closed_from` | string | no | Filter tasks completed on or after. Format: YYYY-MM-DD |
| `date_closed_to` | string | no | Filter tasks completed on or before. Format: YYYY-MM-DD |
| `order_by` | string (`id`, `created`, `updated`, `due_date`) | no | Sort results by field. Default direction is descending, newest first for created/updated. Set reverse: true for ascending (oldest first). |
| `reverse` | boolean | no | Sort ascending (oldest first) instead of the default descending (newest first). Leave unset/false to get the most recently created/updated tasks first. |
| `page` | number | no | 0-indexed page number. Each page returns up to 100 tasks. When a response has has_more=true, request the next page using its next_page value, and keep going until has_more=false to retrieve every matching task. |
| `subtasks` | boolean | no | Include subtasks in results (default: true) |
| `custom_fields` | array | no | Filter by custom field values. Entries combine with AND (and with all other filters). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Values inside one filter combine with OR, and different filters combine with AND. Assignees must be numeric user IDs, so convert names, emails or `me` with `clickup_resolve_assignees` first. Each page returns up to 100 tasks. Keep requesting `page` while the response says `has_more`. For a personal daily queue, `cupt list --json` is simpler. For keyword search across tasks, docs and chats, use `clickup_search`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/filter-tasks.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/filter-tasks.md`

Related references:
- [search.md](../../feature-catalog/mcp-high-priority/search.md): clickup_search
- [resolve-assignees.md](../../feature-catalog/mcp-low-priority/resolve-assignees.md): clickup_resolve_assignees
