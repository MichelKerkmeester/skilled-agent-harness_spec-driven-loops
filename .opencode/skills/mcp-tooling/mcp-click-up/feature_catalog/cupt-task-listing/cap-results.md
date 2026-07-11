---
title: "Cap Results"
description: "cupt list -n <N> — limit output to N rows."
trigger_phrases:
  - "cap results"
  - "cupt list -n"
  - "limit task results"
  - "result count cap"
  - "stop pagination after n tasks"
version: 1.0.0.3
---

# Cap Results

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Stops pagination after N tasks are collected. Useful for large workspaces when only the first batch is needed.

---

## 2. HOW IT WORKS

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
- Feature file path: `cupt-task-listing/cap-results.md`
Related references:
- [mine-only.md](mine-only.md) — Mine Only
- [verbose.md](verbose.md) — Verbose Output
