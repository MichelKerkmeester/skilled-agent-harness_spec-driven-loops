---
title: "Mark Complete"
description: "cupt done <id> — marks task complete using the list's resolved closed status."
---

# Mark Complete

---

## 1. OVERVIEW

Calls `cupt statuses` internally to discover the closed status for the task's list, then updates the task status to that value. Agents never need to know or hardcode the status name.

---

## 2. CURRENT REALITY

Exit 0 on success with a confirmation message. Exit non-zero if no closed status is found for the list (check ClickUp list settings) or on API error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Task completion with status auto-resolution |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Completion
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `04--cupt-task-completion/01-mark-complete.md`
