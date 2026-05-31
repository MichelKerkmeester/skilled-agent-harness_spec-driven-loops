---
title: "List Assigned"
description: "cupt list — tasks assigned to the current user in the default workspace."
---

# List Assigned

---

## 1. OVERVIEW

The base listing command. Returns tasks from the configured workspace assigned to the authenticated user. Output is human-readable by default.

---

## 2. CURRENT REALITY

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
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/01-list-assigned.md`
