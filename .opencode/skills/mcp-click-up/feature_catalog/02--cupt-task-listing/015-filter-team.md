---
title: "Filter by Team"
description: "cupt list --team <name> — client-side filter (5-20s on large workspaces). OR logic when stacked."
trigger_phrases:
  - "filter by team"
  - "cupt list --team"
  - "team task filter"
  - "user-group filter"
  - "filter tasks by team assignment"
---

# Filter by Team

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Filters tasks by team (user-group) assignment. Runs client-side by fetching all tasks and filtering locally. Multiple `--team` flags use OR logic.

---

## 2. HOW IT WORKS

Slow on large workspaces (5-20s) because it walks all paginated results. Always combine with `--tag` to reduce the result set first: `cupt list --tag sprint --team Engineering`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/services/task_service.py` | Service | Client-side team filter |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/015-filter-team.md`
Related references:
- [014-exclude-tag.md](014-exclude-tag.md) — Exclude by Tag
- [016-all-tasks.md](016-all-tasks.md) — All Tasks
