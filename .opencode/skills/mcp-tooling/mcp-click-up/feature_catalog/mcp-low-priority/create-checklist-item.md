---
title: "clickup_create_checklist_item"
description: "Add a new item to an existing checklist."
trigger_phrases:
  - "create checklist item"
  - "clickup_create_checklist_item"
  - "add item to checklist"
  - "append checklist entry"
  - "checklist item creation"
version: 1.0.0.3
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
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-low-priority/create-checklist-item.md`
Related references:
- [delete-checklist.md](delete-checklist.md) — clickup_delete_checklist
- [update-checklist-item.md](update-checklist-item.md) — clickup_update_checklist_item
