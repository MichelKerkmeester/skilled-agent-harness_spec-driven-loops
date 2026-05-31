---
title: "All Tasks"
description: "cupt list --all — include tasks assigned to anyone on the team."
---

# All Tasks

---

## 1. OVERVIEW

Expands the result set from self-assigned to all tasks in the workspace regardless of assignee.

---

## 2. CURRENT REALITY

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
- Feature file path: `02--cupt-task-listing/08-all-tasks.md`
