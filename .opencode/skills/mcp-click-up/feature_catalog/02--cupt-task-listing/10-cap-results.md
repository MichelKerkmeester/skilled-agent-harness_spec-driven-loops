---
title: "Cap Results"
description: "cupt list -n <N> — limit output to N rows."
---

# Cap Results

---

## 1. OVERVIEW

Stops pagination after N tasks are collected. Useful for large workspaces when only the first batch is needed.

---

## 2. CURRENT REALITY

Applied after other filters. Combine with sort (default: due date ascending) to get the N highest-priority tasks.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Result count cap |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/10-cap-results.md`
