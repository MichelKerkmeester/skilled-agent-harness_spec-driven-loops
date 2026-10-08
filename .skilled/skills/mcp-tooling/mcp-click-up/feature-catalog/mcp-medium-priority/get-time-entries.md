---
title: "clickup_get_time_entries"
description: "List time entries, filtered by task, dates, assignee or billable flag."
trigger_phrases:
  - "clickup_get_time_entries"
  - "time entries"
  - "time report"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_time_entries

List time entries, filtered by task, dates, assignee or billable flag.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_time_entries` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get time entries with optional filtering by task, date range, assignee, and billable status. Pass task_id to scope to a single task, or omit for workspace-wide results. IMPORTANT: without assignee, only the authenticated user's entries are returned, pass 'any' to get all users' entries, or specific user IDs (comma-separated) for targeted queries.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | no | Task ID to scope entries to (supports custom IDs like 'DEV-1234'). Omit to query workspace-wide. |
| `start_date` | string | no | Start date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format |
| `end_date` | string | no | End date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format |
| `assignee` | array | no | Filter by assignee user IDs. Pass numeric user IDs (e.g. ['123', '456']) or include 'any' to get ALL users' entries. IMPORTANT: when omitted, the API returns only the authenticated user's entries. Use get_workspace_members to look up user IDs. |
| `is_billable` | boolean | no | Filter by billable status. Set to true for only billable entries, false for non-billable. Omit to get all entries. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Without `assignee`, only the signed-in user's entries come back.

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
- Feature file path: `mcp-medium-priority/get-time-entries.md`

Related references:
- [add-time-entry.md](../../feature-catalog/mcp-medium-priority/add-time-entry.md): clickup_add_time_entry
