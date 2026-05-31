---
title: "Show Task"
description: "cupt show <id> — full task details: name, description, status, assignees, tags, due date."
trigger_phrases:
  - "show task"
  - "cupt show"
  - "task details"
  - "full task record"
  - "inspect clickup task"
---

# Show Task

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns the complete task record from ClickUp. Fields include: name, description, status, priority, assignees, tags, due_date, time_estimate, time_spent, url, list, space, folder.

---

## 2. HOW IT WORKS

Output is human-readable by default. Add `--json` for structured output. Add `--notes` to append comments. Results are cached for subsequent `--offline` use.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Single task detail fetch |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Details
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--cupt-task-details/023-show-task.md`
Related references:
- [024-show-notes.md](024-show-notes.md) — Show with Notes
