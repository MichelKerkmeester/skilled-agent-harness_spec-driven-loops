---
title: "Filter by Team"
description: "cupt list --team <name> — client-side filter (5-20s on large workspaces). OR logic when stacked."
---

# Filter by Team

---

## 1. OVERVIEW

Filters tasks by team (user-group) assignment. Runs client-side by fetching all tasks and filtering locally. Multiple `--team` flags use OR logic.

---

## 2. CURRENT REALITY

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
- Feature file path: `02--cupt-task-listing/07-filter-team.md`
