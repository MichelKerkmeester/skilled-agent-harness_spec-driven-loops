---
title: "Status Schema by Task"
description: "cupt statuses <id> — lists all statuses for the task's list, marking the closed status."
---

# Status Schema by Task

---

## 1. OVERVIEW

Queries the status schema for the list that contains the specified task. Returns all status names and their types. The closed status is marked explicitly.

---

## 2. CURRENT REALITY

CRITICAL for agents: always call `cupt statuses <id>` before `cupt done <id>`. Status names vary per list — 'Done' in one list may be 'Complete', 'Shipped', or 'Closed' in another. Never hardcode status names.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | List status schema discovery |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Details
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--cupt-task-details/05-status-schema.md`
