---
title: "Filter Week"
description: "cupt list --week — tasks due within the current week."
---

# Filter Week

---

## 1. OVERVIEW

Server-side date filter returning tasks due within the current calendar week (Monday-Sunday).

---

## 2. CURRENT REALITY

Useful for sprint planning and weekly triage. Combine with `--tag` for focused team queues.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Date filtering — week |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/03-filter-week.md`
