---
title: "Show with Notes"
description: "cupt show <id> --notes — append all comments to the task output."
---

# Show with Notes

---

## 1. OVERVIEW

Extends `cupt show` to include all comments on the task in chronological order. Each comment shows author name, timestamp, and text.

---

## 2. CURRENT REALITY

Useful for understanding task history before acting. Equivalent to running `cupt show` + `cupt notes` in one call.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Task + comment combined fetch |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Details
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--cupt-task-details/02-show-notes.md`
