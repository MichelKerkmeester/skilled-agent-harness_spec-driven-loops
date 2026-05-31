---
title: "clickup_delete_checklist_item"
description: "Remove a specific item from a checklist."
trigger_phrases:
  - "delete checklist item"
  - "clickup_delete_checklist_item"
  - "remove checklist item"
  - "delete single checklist entry"
  - "drop one checklist item"
---

# clickup_delete_checklist_item

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Permanently removes a single item from a checklist. Required: `checklist_id`, `checklist_item_id`. Not reversible.

---

## 2. HOW IT WORKS

Use when removing a specific completed or unnecessary checklist item while keeping the checklist and other items.

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
- Feature file path: `13--mcp-low-priority/091-delete-checklist-item.md`
Related references:
- [090-update-checklist-item.md](090-update-checklist-item.md) — clickup_update_checklist_item
- [092-get-doc-pages.md](092-get-doc-pages.md) — clickup_get_document_pages
