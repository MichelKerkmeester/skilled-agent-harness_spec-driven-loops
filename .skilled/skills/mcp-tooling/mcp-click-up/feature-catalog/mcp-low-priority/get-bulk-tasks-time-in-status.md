---
title: "clickup_get_bulk_tasks_time_in_status"
description: "Show time in status for up to 100 tasks at once."
trigger_phrases:
  - "clickup_get_bulk_tasks_time_in_status"
  - "bulk time in status"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_bulk_tasks_time_in_status

Show time in status for up to 100 tasks at once.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_bulk_tasks_time_in_status` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get the time multiple tasks have spent in each status (bulk operation, up to 100 tasks). Returns a map of task IDs to their status history and current status time data. Requires the "Total time in Status" ClickApp to be enabled in the workspace.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_ids` | array | yes | Array of task IDs to get time in status for (1-100 tasks). Works with both regular task IDs and custom IDs (like 'DEV-1234'). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Needs the Total time in Status ClickApp.

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
- Feature file path: `mcp-low-priority/get-bulk-tasks-time-in-status.md`

Related references:
- [get-task-time-in-status.md](../../feature-catalog/mcp-low-priority/get-task-time-in-status.md): clickup_get_task_time_in_status
