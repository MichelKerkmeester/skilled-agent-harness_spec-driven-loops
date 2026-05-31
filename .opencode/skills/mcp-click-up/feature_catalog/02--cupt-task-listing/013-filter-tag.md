---
title: "Filter by Tag"
description: "cupt list --tag <name> — server-side tag filter (fast). AND logic when stacked."
trigger_phrases:
  - "filter by tag"
  - "cupt list --tag"
  - "tag filter tasks"
  - "server-side tag filter"
  - "filter tasks by label"
---

# Filter by Tag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Filters tasks by tag name using a server-side API parameter. Multiple `--tag` flags use AND logic: the task must carry ALL specified tags.

---

## 2. HOW IT WORKS

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
- Feature file path: `02--cupt-task-listing/013-filter-tag.md`
Related references:
- [012-filter-overdue.md](012-filter-overdue.md) — Filter Overdue
- [014-exclude-tag.md](014-exclude-tag.md) — Exclude by Tag
