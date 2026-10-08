---
title: "clickup_add_time_entry"
description: "Log a manual time entry on a task."
trigger_phrases:
  - "clickup_add_time_entry"
  - "log time mcp"
  - "manual time entry"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_add_time_entry

Log a manual time entry on a task.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_add_time_entry` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Add a manual time entry to a task. You can provide either (start + duration) OR (start + end). The tool will calculate missing values. Requires task_id, start time, and either duration or end time. Supports description, billable flag, and tags.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `start` | string | yes | Start time in YYYY-MM-DD HH:MM format (e.g., '2025-01-15 09:30'). Time is required for time tracking entries. |
| `duration` | string | no | Duration of the time entry. Format as 'Xh Ym' (e.g., '1h 30m') or just minutes (e.g., '90m'). Either duration or end_time is required. |
| `end_time` | string | no | End time in YYYY-MM-DD HH:MM format (e.g., '2025-01-15 11:00'). Time is required for time tracking entries. |
| `description` | string | no | Description for the time entry. Keep short and simple, or omit for best compatibility. |
| `billable` | boolean | no | Whether this time is billable. Default is workspace setting. |
| `tags` | array | no | Array of tag names to assign to the time entry. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass `task_id`, `start` and either `duration` or `end_time`. `cupt time add <id> <dur>` covers the common case.

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
- Feature file path: `mcp-medium-priority/add-time-entry.md`

Related references:
- [get-time-entries.md](../../feature-catalog/mcp-medium-priority/get-time-entries.md): clickup_get_time_entries
