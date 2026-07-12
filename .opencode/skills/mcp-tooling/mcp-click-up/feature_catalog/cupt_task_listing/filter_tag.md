---
title: "Filter by Tag"
description: "cupt list --tag <name> — server-side tag filter (fast). AND logic when stacked."
trigger_phrases:
  - "filter by tag"
  - "cupt list --tag"
  - "tag filter tasks"
  - "server-side tag filter"
  - "filter tasks by label"
version: 1.0.0.3
---

# Filter by Tag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Filters tasks by tag name. The ClickUp API's `tags[]` parameter is OR semantics — the server returns tasks bearing ANY listed tag. cupt then applies AND enforcement client-side over that candidate set, so the net result matches only tasks carrying ALL specified tags.

---

## 2. HOW IT WORKS

Tag filtering combines a fast server-side OR prefetch with client-side AND enforcement. Tag name matching is case-insensitive. Stackable: `--tag sprint --tag backend` returns only tasks with both tags.

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
- Feature file path: `cupt-task-listing/filter-tag.md`
Related references:
- [filter-overdue.md](filter-overdue.md) — Filter Overdue
- [exclude-tag.md](exclude-tag.md) — Exclude by Tag
