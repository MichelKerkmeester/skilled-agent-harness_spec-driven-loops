---
title: "clickup_stop_time_tracking"
description: "Stop the running timer and return the finished entry."
trigger_phrases:
  - "clickup_stop_time_tracking"
  - "stop timer mcp"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_stop_time_tracking

Stop the running timer and return the finished entry.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_stop_time_tracking` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Stop the currently running time tracker. Supports description and tags. Returns the completed time entry details.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `description` | string | no | Description to update or add to the time entry. |
| `tags` | array | no | Array of tag names to assign to the time entry. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

`cupt time stop` does the same job for daily use.

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
- Feature file path: `mcp-medium-priority/stop-time-tracking.md`

Related references:
- [start-time-tracking.md](../../feature-catalog/mcp-medium-priority/start-time-tracking.md): clickup_start_time_tracking
