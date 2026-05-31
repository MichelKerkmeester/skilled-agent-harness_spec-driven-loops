---
title: "Filter Overdue"
description: "cupt list --overdue — past-due tasks only."
trigger_phrases:
  - "filter overdue"
  - "cupt list --overdue"
  - "past-due tasks"
  - "overdue task filter"
  - "backlog debt triage"
---

# Filter Overdue

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns tasks whose due date is before today and status is not closed. Server-side filter.

---

## 2. HOW IT WORKS

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
- Feature file path: `02--cupt-task-listing/012-filter-overdue.md`
Related references:
- [011-filter-week.md](011-filter-week.md) — Filter Week
- [013-filter-tag.md](013-filter-tag.md) — Filter by Tag
