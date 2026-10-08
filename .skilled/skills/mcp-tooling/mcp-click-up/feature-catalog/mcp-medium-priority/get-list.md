---
title: "clickup_get_list"
description: "Read a list by ID or name, including its configured statuses."
trigger_phrases:
  - "clickup_get_list"
  - "get list"
  - "list statuses"
  - "find list id"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_list

Read a list by ID or name, including its configured statuses.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_list` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get list details by list_id or list_name. Returns id, name, content, space info, and configured statuses. Use to resolve list names to IDs.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `list_id` | string | no | ID of the list to retrieve. |
| `list_name` | string | no | Name of the list to retrieve. The tool will search for a list with this name. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use it to turn a list name into an ID before `clickup_create_task` or `clickup_move_task`.

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
- Feature file path: `mcp-medium-priority/get-list.md`

Related references:
- [update-list.md](../../feature-catalog/mcp-medium-priority/update-list.md): clickup_update_list
- [create-task.md](../../feature-catalog/mcp-high-priority/create-task.md): clickup_create_task
