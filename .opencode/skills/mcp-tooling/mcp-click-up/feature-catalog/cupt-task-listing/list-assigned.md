---
title: "List Assigned"
description: "cupt list — tasks assigned to the current user in the default workspace."
trigger_phrases:
  - "list assigned"
  - "cupt list"
  - "list my tasks"
  - "assigned task listing"
  - "show open tasks"
version: 1.0.0.3
---

# List Assigned

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

The base listing command. Returns tasks from the configured workspace assigned to the authenticated user. Output is human-readable by default.

---

## 2. HOW IT WORKS

Returns all assigned open tasks across all lists. Paginates transparently. Empty result `[]` is valid — not an error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Task listing with pagination |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-task-listing/list-assigned.md`
Related references:
- [filter-today.md](../../feature-catalog/cupt-task-listing/filter-today.md) — Filter Today
