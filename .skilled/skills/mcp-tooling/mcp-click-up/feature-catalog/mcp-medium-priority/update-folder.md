---
title: "clickup_update_folder"
description: "Rename a folder or change its statuses."
trigger_phrases:
  - "clickup_update_folder"
  - "rename folder"
  - "update folder"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_folder

Rename a folder or change its statuses.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_update_folder` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Update a ClickUp folder. Requires folder_id + at least one update field (name/override_statuses). Only specified fields updated. Changes apply to all lists in folder. If you need to get a folder ID from a folder name, use clickup_get_folder first.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `folder_id` | string | yes | ID of the folder to update. |
| `name` | string | no | New name for the folder. |
| `override_statuses` | boolean | no | Whether to override space statuses with folder-specific statuses. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Status changes apply to every list in the folder.

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
- Feature file path: `mcp-medium-priority/update-folder.md`

Related references:
- [get-folder.md](../../feature-catalog/mcp-medium-priority/get-folder.md): clickup_get_folder
