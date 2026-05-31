---
title: "Status Schema by List"
description: "cupt statuses --list <list-id> — query the status schema for a list without a task ID."
---

# Status Schema by List

---

## 1. OVERVIEW

Alternative form of status discovery that takes a list ID directly rather than a task ID. Useful when planning batch operations across all tasks in a list before fetching individual tasks.

---

## 2. CURRENT REALITY

Same output as `cupt statuses <task-id>` but resolves via list ID instead of task lookup. Saves an extra API call when the list ID is already known.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | List status schema by list ID |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Details
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--cupt-task-details/06-status-by-list.md`
