---
title: "clickup_delete_checklist_item"
description: "Remove a specific item from a checklist."
---

# clickup_delete_checklist_item

---

## 1. OVERVIEW

Permanently removes a single item from a checklist. Required: `checklist_id`, `checklist_item_id`. Not reversible.

---

## 2. CURRENT REALITY

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
- Feature file path: `13--mcp-low-priority/14-delete-checklist-item.md`
