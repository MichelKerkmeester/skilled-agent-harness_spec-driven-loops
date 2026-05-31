---
title: "clickup_update_checklist_item"
description: "Update a checklist item: change text or mark as resolved/unresolved."
trigger_phrases:
  - "update checklist item"
  - "clickup_update_checklist_item"
  - "check off checklist item"
  - "mark item resolved"
  - "uncheck checklist entry"
---

# clickup_update_checklist_item

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Modifies an existing checklist item. Required: `checklist_id`, `checklist_item_id`. Optional: `name`, `resolved` (true/false), `assignee`.

---

## 2. HOW IT WORKS

Use `resolved: true` to check off a checklist item, `resolved: false` to uncheck it.

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
- Feature file path: `13--mcp-low-priority/090-update-checklist-item.md`
Related references:
- [089-create-checklist-item.md](089-create-checklist-item.md) — clickup_create_checklist_item
- [091-delete-checklist-item.md](091-delete-checklist-item.md) — clickup_delete_checklist_item
