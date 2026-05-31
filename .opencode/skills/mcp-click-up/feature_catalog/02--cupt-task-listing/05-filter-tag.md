---
title: "Filter by Tag"
description: "cupt list --tag <name> — server-side tag filter (fast). AND logic when stacked."
---

# Filter by Tag

---

## 1. OVERVIEW

Filters tasks by tag name using a server-side API parameter. Multiple `--tag` flags use AND logic: the task must carry ALL specified tags.

---

## 2. CURRENT REALITY

Tag filters are fast because they run server-side. Tag names are case-sensitive. Stackable: `--tag sprint --tag backend` returns only tasks with both tags.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Tag filtering (server-side) |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/05-filter-tag.md`
