---
title: "clickup_get_list_location"
description: "Name and link the space and folders that contain a list."
trigger_phrases:
  - "clickup_get_list_location"
  - "list location"
  - "list breadcrumbs"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_list_location

Name and link the space and folders that contain a list.

> **Live name (2026-11-06).** Call it as `clickup_official.clickup_official_clickup_get_list_location` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 67 tools on that date.

---

## 1. OVERVIEW

Get the space, the folders from the space down, and the list itself, each with its ClickUp URL, as the breadcrumb a task card shows.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `list_id` | string | yes | ID of the list. |
| `space_id` | string | no | ID of the space that contains the list, when known. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

It returns `crumbs`, a list of `{ name, url }` from the space down to the list. It does not find a list. Use `clickup_get_list` or `clickup_get_workspace_hierarchy` for that.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual playbook | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/get-list-location.md`

Related references:
- [get-list.md](../../feature-catalog/mcp-medium-priority/get-list.md): clickup_get_list
