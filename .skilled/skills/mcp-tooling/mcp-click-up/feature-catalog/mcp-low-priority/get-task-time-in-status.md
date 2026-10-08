---
title: "clickup_get_task_time_in_status"
description: "Show how long a task has spent in each status."
trigger_phrases:
  - "clickup_get_task_time_in_status"
  - "time in status"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_task_time_in_status

Show how long a task has spent in each status.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_task_time_in_status` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get the time a task has spent in each status. Returns the current status with elapsed time and the full status history with time spent in each status. Requires the "Total time in Status" ClickApp to be enabled in the workspace.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of task. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
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
- Feature file path: `mcp-low-priority/get-task-time-in-status.md`

Related references:
- [get-bulk-tasks-time-in-status.md](../../feature-catalog/mcp-low-priority/get-bulk-tasks-time-in-status.md): clickup_get_bulk_tasks_time_in_status
