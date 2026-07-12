---
title: "All Tasks"
description: "cupt list --all — include tasks assigned to anyone on the team."
trigger_phrases:
  - "all tasks"
  - "cupt list --all"
  - "list all assignees"
  - "team-wide task listing"
  - "expand to all workspace tasks"
version: 1.0.0.3
---

# All Tasks

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Expands the result set from self-assigned to all tasks in the workspace regardless of assignee. Bounded, not exhaustive: without `--team`, fetches at most 5 pages and stops early once 100 tasks are collected — very large workspaces may be truncated.

---

## 2. HOW IT WORKS

Use when processing team-wide queues. Significantly larger result set than default. Combine with `--tag` for targeted filtering.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Scope expansion to all assignees |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `cupt-task-listing/all-tasks.md`
Related references:
- [filter-team.md](../cupt_task_listing/filter_team.md) — Filter by Team
- [mine-only.md](../cupt_task_listing/mine_only.md) — Mine Only
