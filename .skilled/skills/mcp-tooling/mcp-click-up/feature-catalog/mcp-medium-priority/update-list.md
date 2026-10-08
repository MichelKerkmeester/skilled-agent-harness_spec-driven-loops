---
title: "clickup_update_list"
description: "Change a list's name, content or status."
trigger_phrases:
  - "clickup_update_list"
  - "rename list"
  - "update list"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_list

Change a list's name, content or status.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_update_list` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Update a ClickUp list. Requires list_id + at least one update field (name/content/status). Only specified fields updated. If you need to get a list ID from a list name, use clickup_get_list first.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `list_id` | string | yes | ID of the list to update. |
| `name` | string | no | New name for the list. |
| `content` | string | no | New description or content for the list. |
| `status` | string | no | New status for the list. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Only the fields you pass change. The server has no delete-list tool.

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
- Feature file path: `mcp-medium-priority/update-list.md`

Related references:
- [get-list.md](../../feature-catalog/mcp-medium-priority/get-list.md): clickup_get_list
