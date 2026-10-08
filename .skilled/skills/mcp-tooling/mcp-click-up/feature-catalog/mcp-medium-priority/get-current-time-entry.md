---
title: "clickup_get_current_time_entry"
description: "Read the running time entry, if there is one."
trigger_phrases:
  - "clickup_get_current_time_entry"
  - "current timer"
  - "running timer"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_current_time_entry

Read the running time entry, if there is one.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_current_time_entry` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get the currently running time entry, if any. No parameters needed.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

`cupt time status` covers the same check.

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
- Feature file path: `mcp-medium-priority/get-current-time-entry.md`

Related references:
- [stop-time-tracking.md](../../feature-catalog/mcp-medium-priority/stop-time-tracking.md): clickup_stop_time_tracking
