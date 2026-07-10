---
title: "Show Offline"
description: "cupt show <id> --offline — return cached task data without a network call."
trigger_phrases:
  - "show offline"
  - "cupt show --offline"
  - "cached task detail"
  - "offline task view"
  - "task detail without network"
version: 1.0.0.3
---

# Show Offline

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns the most recently cached version of the task. Requires prior `cupt list` (which auto-populates cache) or `cupt prefetch`.

---

## 2. HOW IT WORKS

Stale risk: cache may be hours old. Use `cupt config --clear-cache` followed by `cupt list` to refresh. Useful in rate-limited or network-restricted scenarios.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Cache-backed task detail |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Details
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--cupt-task-details/show-offline.md`
Related references:
- [show-notes.md](show-notes.md) — Show with Notes
- [task-context.md](task-context.md) — Task Context
