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

Does NOT stop pagination — cupt fetches and filters the full result set first, then slices the first N rows from that already-fetched list. Useful for trimming display output, not for reducing API calls or pages walked.

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
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-task-listing/cap-results.md`
Related references:
- [mine-only.md](../../feature-catalog/cupt-task-listing/mine-only.md) — Mine Only
- [verbose.md](verbose.md) — Verbose Output
