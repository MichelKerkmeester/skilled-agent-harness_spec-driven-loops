---
title: "clickup_update_checklist_item"
description: "Update a checklist item: change text or mark as resolved/unresolved."
trigger_phrases:
  - "update checklist item"
  - "clickup_update_checklist_item"
  - "check off checklist item"
  - "mark item resolved"
  - "uncheck checklist entry"
version: 1.0.0.3
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
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/update-checklist-item.md`
Related references:
- [create-checklist-item.md](create-checklist-item.md) — clickup_create_checklist_item
- [delete-checklist-item.md](delete-checklist-item.md) — clickup_delete_checklist_item
