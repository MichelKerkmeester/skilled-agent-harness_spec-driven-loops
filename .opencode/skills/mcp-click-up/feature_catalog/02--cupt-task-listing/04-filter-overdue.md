---
title: "Filter Overdue"
description: "cupt list --overdue — past-due tasks only."
---

# Filter Overdue

---

## 1. OVERVIEW

Returns tasks whose due date is before today and status is not closed. Server-side filter.

---

## 2. CURRENT REALITY

Use in triage workflows to surface backlog debt. Combine with `--all` to include team overdue tasks.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Date filtering — overdue |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/04-filter-overdue.md`
