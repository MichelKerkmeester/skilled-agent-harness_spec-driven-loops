---
title: "clickup_delete_checklist"
description: "Delete a checklist from a task. All items in the checklist are also deleted."
trigger_phrases:
  - "delete checklist"
  - "clickup_delete_checklist"
  - "remove checklist from task"
  - "permanently delete checklist"
  - "drop checklist and all items"
version: 1.0.0.3
---

# clickup_delete_checklist

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Permanently removes a checklist and all its items from the task. Required: `checklist_id`. Not reversible.

---

## 2. HOW IT WORKS

Use only when removing an entire checklist and all items. To remove individual items, use `clickup_delete_checklist_item`.

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
- Feature file path: `13--mcp-low-priority/delete-checklist.md`
Related references:
- [update-checklist.md](update-checklist.md) — clickup_update_checklist
- [create-checklist-item.md](create-checklist-item.md) — clickup_create_checklist_item
