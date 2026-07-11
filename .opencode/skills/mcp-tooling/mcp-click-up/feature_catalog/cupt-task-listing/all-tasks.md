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

Expands the result set from self-assigned to all tasks in the workspace regardless of assignee.

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
- [filter-team.md](filter-team.md) — Filter by Team
- [mine-only.md](mine-only.md) — Mine Only
