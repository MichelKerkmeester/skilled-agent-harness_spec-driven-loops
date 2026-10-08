---
title: "clickup_get_workspace_hierarchy"
description: "Read the workspace structure: spaces, folders and lists, with paging and depth control."
trigger_phrases:
  - "clickup_get_workspace_hierarchy"
  - "workspace hierarchy"
  - "list spaces"
  - "find list id"
  - "mcp smoke test"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_workspace_hierarchy

Read the workspace structure: spaces, folders and lists, with paging and depth control.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_workspace_hierarchy` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get workspace hierarchy (spaces, folders, lists) with pagination and depth control. Use only when you need the workspace structure, most tools resolve names automatically.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `cursor` | string | no | Pagination cursor from previous response. Use to fetch next page of spaces |
| `limit` | number | no | Maximum number of spaces to return per page (default: 10, max: 50) |
| `max_depth` | string (`0`, `1`, `2`) | no | Maximum depth of hierarchy to return: 0=spaces only, 1=spaces+folders, 2=spaces+folders+lists (default: 2) |
| `space_ids` | array | no | Filter to return only specific spaces by ID. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

This is the connection smoke test for the MCP route, because it needs no IDs. Most tools resolve list and folder names on their own, so call this only when you need the structure. Limit the output with `max_depth` or `space_ids` on large workspaces.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/get-workspace-hierarchy.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/get-workspace-hierarchy.md`

Related references:
- [get-list.md](../../feature-catalog/mcp-medium-priority/get-list.md): clickup_get_list
- [get-folder.md](../../feature-catalog/mcp-medium-priority/get-folder.md): clickup_get_folder
