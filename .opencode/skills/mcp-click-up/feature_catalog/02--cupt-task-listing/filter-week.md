---
title: "Filter Week"
description: "cupt list --week — tasks due within the current week."
trigger_phrases:
  - "filter week"
  - "cupt list --week"
  - "tasks due this week"
  - "weekly task filter"
  - "sprint planning tasks"
---

# Filter Week

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Server-side date filter returning tasks due within the current calendar week (Monday-Sunday).

---

## 2. HOW IT WORKS

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
- Feature file path: `02--cupt-task-listing/filter-week.md`
Related references:
- [filter-today.md](filter-today.md) — Filter Today
- [filter-overdue.md](filter-overdue.md) — Filter Overdue
