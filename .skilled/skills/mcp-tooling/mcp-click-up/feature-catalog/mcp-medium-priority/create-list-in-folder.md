---
title: "clickup_create_list_in_folder"
description: "Create a list inside a folder."
trigger_phrases:
  - "clickup_create_list_in_folder"
  - "create list in folder"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_list_in_folder

Create a list inside a folder.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_list_in_folder` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create a list in a ClickUp folder. Requires folder_id and list name. Supports content and status. If you need to get a folder ID from a folder name, use clickup_get_folder first.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `name` | string | yes | Name of the list. |
| `folder_id` | string | yes | ID of the folder to create the list in. |
| `content` | string | no | Description or content of the list. |
| `status` | string | no | Status of the list (uses folder default if not specified). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass `name` and `folder_id`. Resolve a folder name with `clickup_get_folder`.

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
- Feature file path: `mcp-medium-priority/create-list-in-folder.md`

Related references:
- [create-list.md](../../feature-catalog/mcp-medium-priority/create-list.md): clickup_create_list
- [get-folder.md](../../feature-catalog/mcp-medium-priority/get-folder.md): clickup_get_folder
