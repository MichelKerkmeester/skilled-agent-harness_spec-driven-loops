---
title: "Task Context"
description: "cupt context <id> — shows parent task, siblings, and direct subtasks."
trigger_phrases:
  - "task context"
  - "cupt context"
  - "task hierarchy"
  - "parent and subtasks"
  - "task structure traversal"
version: 1.0.0.3
---

# Task Context

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns the hierarchical context of a task: the parent task (if any), sibling tasks at the same level, and direct subtasks. Essential for understanding where a task sits in the project structure.

---

## 2. HOW IT WORKS

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
- Feature file path: `03--cupt-task-details/task-context.md`
Related references:
- [show-offline.md](show-offline.md) — Show Offline
- [status-schema.md](status-schema.md) — Status Schema by Task
