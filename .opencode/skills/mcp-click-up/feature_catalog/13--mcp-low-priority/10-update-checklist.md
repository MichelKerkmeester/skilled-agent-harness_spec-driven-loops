---
title: "clickup_update_checklist"
description: "Update a checklist name or ordering."
---

# clickup_update_checklist

---

## 1. OVERVIEW

Modifies the name or order of an existing checklist. Required: `checklist_id`. Optional: `name`, `position`.

---

## 2. CURRENT REALITY

Does not affect checklist items — only the checklist container itself.

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
- Feature file path: `13--mcp-low-priority/10-update-checklist.md`
