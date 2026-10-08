---
title: "clickup_start_time_tracking"
description: "Start a timer on a task."
trigger_phrases:
  - "clickup_start_time_tracking"
  - "start timer mcp"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_start_time_tracking

Start a timer on a task.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_start_time_tracking` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Start time tracking on a task. Supports description, billable status, and tags. Only one timer can be running at a time. For best results, omit extra parameters unless specifically needed.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `description` | string | no | Description for the time entry. Keep short and simple, or omit for best compatibility. |
| `billable` | boolean | no | Whether this time is billable. Default is workspace setting. |
| `tags` | array | no | Array of tag names to assign to the time entry. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Only one timer can run at a time. `cupt time start <id>` does the same job for daily use.

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
- Feature file path: `mcp-medium-priority/start-time-tracking.md`

Related references:
- [stop-time-tracking.md](../../feature-catalog/mcp-medium-priority/stop-time-tracking.md): clickup_stop_time_tracking
- [get-current-time-entry.md](../../feature-catalog/mcp-medium-priority/get-current-time-entry.md): clickup_get_current_time_entry
