---
title: "Task Context"
description: "cupt context <id> — shows parent task, siblings, and direct subtasks."
---

# Task Context

---

## 1. OVERVIEW

Returns the hierarchical context of a task: the parent task (if any), sibling tasks at the same level, and direct subtasks. Essential for understanding where a task sits in the project structure.

---

## 2. CURRENT REALITY

Always run `cupt context <id>` before completing or reassigning a task to avoid orphaning related work. Output is human-readable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/context.py` | CLI | Task hierarchy traversal |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Details
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--cupt-task-details/04-task-context.md`
