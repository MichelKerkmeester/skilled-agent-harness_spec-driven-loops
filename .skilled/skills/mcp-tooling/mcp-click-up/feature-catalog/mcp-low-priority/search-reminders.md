---
title: "clickup_search_reminders"
description: "List and filter the user's reminders."
trigger_phrases:
  - "clickup_search_reminders"
  - "my reminders"
  - "overdue reminders"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_search_reminders

List and filter the user's reminders.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_search_reminders` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Search and list your reminders. Supports filtering by type, status, completion, and since date. Date filters use YYYY-MM-DD or YYYY-MM-DD HH:MM format (e.g., '2025-01-01') in your timezone. Paginated via cursor.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `due_date_status` | string (`TODO`, `LATER`, `DELETED`) | no | Filter reminders by due date status (TODO, LATER, DELETED) |
| `reminder_type` | string (`ASSIGNED_COMMENT`, `UNANSWERED_MENTION`, `APPROVAL`, `SAVED`, `REMINDER`) | no | Filter by type of reminder (ASSIGNED_COMMENT, UNANSWERED_MENTION, APPROVAL, SAVED, REMINDER) |
| `is_overdue` | boolean | no | Filter to show only overdue reminders |
| `is_completed` | boolean | no | Filter to show only completed or incomplete reminders |
| `limit` | number | no | Maximum number of reminders to return per page (default: 25, max: 100) |
| `cursor` | string | no | Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results |
| `since` | string | no | Filter reminders updated since this date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format (e.g., '2025-01-01' or '2025-01-01 09:00') |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Filter by status, type, completion or a since date. Results page with `cursor`.

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

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/search-reminders.md`

Related references:
- [update-reminder.md](../../feature-catalog/mcp-low-priority/update-reminder.md): clickup_update_reminder
