---
title: "Stacked Filters"
description: "Multiple --tag (AND), multiple --team (OR), combined with date and scope flags."
---

# Stacked Filters

---

## 1. OVERVIEW

cupt list supports stacking filters freely: `--tag A --tag B` requires both tags (AND); `--team X --team Y` matches either team (OR). Date and scope flags combine additively.

---

## 2. CURRENT REALITY

Most efficient pattern: server-side tag filters first, then client-side team filters. Example: `cupt list --all --tag ai_ready --tag sprint --team Engineering --json`. Agent should document the combined intent clearly.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/services/task_service.py` | Service | Filter combination logic |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/14-stacked-filters.md`
