---
title: "Filter Today"
description: "cupt list --today — tasks due today only."
trigger_phrases:
  - "filter today"
  - "cupt list --today"
  - "tasks due today"
  - "today date filter"
  - "daily task queue"
---

# Filter Today

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Server-side date filter returning only tasks with a due date matching today's date in the workspace timezone.

---

## 2. HOW IT WORKS

Combines with tag and team filters. Use `cupt list --today --json` as the standard agent daily-queue fetch.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Date filtering — today |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/010-filter-today.md`
Related references:
- [009-list-assigned.md](009-list-assigned.md) — List Assigned
- [011-filter-week.md](011-filter-week.md) — Filter Week
