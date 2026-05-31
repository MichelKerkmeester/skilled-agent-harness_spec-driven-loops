---
title: "clickup_create_checklist_item"
description: "Add a new item to an existing checklist."
trigger_phrases:
  - "create checklist item"
  - "clickup_create_checklist_item"
  - "add item to checklist"
  - "append checklist entry"
  - "checklist item creation"
---

# clickup_create_checklist_item

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Appends a new item to the specified checklist. Required: `checklist_id`, `name`. Optional: `assignee` (user ID), `resolved` (boolean).

---

## 2. HOW IT WORKS

Items are appended to the end of the checklist by default. Returns `checklist_item_id` for subsequent updates.

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

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/089-create-checklist-item.md`
Related references:
- [088-delete-checklist.md](088-delete-checklist.md) — clickup_delete_checklist
- [090-update-checklist-item.md](090-update-checklist-item.md) — clickup_update_checklist_item
