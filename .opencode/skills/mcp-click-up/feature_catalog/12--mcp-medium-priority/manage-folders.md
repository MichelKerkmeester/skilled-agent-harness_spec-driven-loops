---
title: "clickup_manage_folders"
description: "Create, update, or delete folders within a space."
trigger_phrases:
  - "manage folders"
  - "clickup_manage_folders"
  - "create clickup folder"
  - "delete folder"
  - "folder organization in space"
version: 1.0.0.3
---

# clickup_manage_folders

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

CRUD operations on ClickUp folders. Create: requires `space_id`, `name`. Update/delete: requires `folder_id`.

---

## 2. HOW IT WORKS

Folders organize lists within a space. Creating a folder does not create lists inside it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/manage-folders.md`
Related references:
- [manage-spaces.md](manage-spaces.md) — clickup_manage_spaces
- [custom-fields.md](custom-fields.md) — clickup_manage_custom_fields
