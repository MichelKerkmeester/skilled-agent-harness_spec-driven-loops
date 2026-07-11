---
title: "Filter Today"
description: "cupt list --today — tasks due today only."
trigger_phrases:
  - "filter today"
  - "cupt list --today"
  - "tasks due today"
  - "today date filter"
  - "daily task queue"
version: 1.0.0.3
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
- Feature file path: `cupt-task-listing/filter-today.md`
Related references:
- [list-assigned.md](list-assigned.md) — List Assigned
- [filter-week.md](filter-week.md) — Filter Week
