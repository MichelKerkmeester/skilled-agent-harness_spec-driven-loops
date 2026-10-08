---
title: "clickup_search"
description: "Keyword search across the workspace: tasks, docs, dashboards, attachments, whiteboards, chats and forms."
trigger_phrases:
  - "clickup_search"
  - "search clickup"
  - "find doc"
  - "keyword search workspace"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_search

Keyword search across the workspace: tasks, docs, dashboards, attachments, whiteboards, chats and forms.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_search` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Search across all workspace content (tasks, docs, dashboards, attachments, whiteboards, chats, forms). Best for keyword/text matching across all content types. For filtering tasks by field values (status, priority, tags, dates), use filter_tasks instead. Supports filtering by assignees, creators, status, location, asset types, and date ranges. Date filters use YYYY-MM-DD or YYYY-MM-DD HH:MM format in your timezone. Results are paginated: the response includes next_cursor whenever more results exist. When next_cursor is present you MUST call search again with that value in the cursor field (repeating until next_cursor is absent) to retrieve every match, a single call is not guaranteed to be complete.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `keywords` | string | no | Search query string. Use specific keywords to find items |
| `sort` | array | no | Sort criteria for results. Can specify multiple sort fields in priority order |
| `filters` | object | no | Filters to refine search results by various criteria |
| `count` | number | no | Maximum number of results to return per page (for pagination) |
| `cursor` | string | no | Pagination cursor from previous response. Use to fetch next page of results |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use this for text matching across content types. It is also the quickest way to find a doc or page ID by name. For filtering tasks by field values, use `clickup_filter_tasks` instead. Results page with `count` and `cursor`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/search.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/search.md`

Related references:
- [filter-tasks.md](../../feature-catalog/mcp-high-priority/filter-tasks.md): clickup_filter_tasks
- [list-document-pages.md](../../feature-catalog/mcp-low-priority/list-document-pages.md): clickup_list_document_pages
