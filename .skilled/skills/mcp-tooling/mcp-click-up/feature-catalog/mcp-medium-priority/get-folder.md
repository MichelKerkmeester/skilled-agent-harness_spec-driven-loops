---
title: "clickup_get_folder"
description: "Read a folder by ID or name."
trigger_phrases:
  - "clickup_get_folder"
  - "get folder"
  - "find folder id"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_folder

Read a folder by ID or name.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_folder` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get folder details by folder_id or folder_name (+ space info). Use to resolve folder names to IDs.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `folder_id` | string | no | ID of the folder to retrieve. |
| `folder_name` | string | no | Name of the folder to retrieve. When using this, you must also provide space_id or space_name. |
| `space_id` | string | no | ID of the space containing the folder (required with folder_name). |
| `space_name` | string | no | Name of the space containing the folder (required with folder_name). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use it to turn a folder name into an ID.

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
- Feature file path: `mcp-medium-priority/get-folder.md`

Related references:
- [update-folder.md](../../feature-catalog/mcp-medium-priority/update-folder.md): clickup_update_folder
