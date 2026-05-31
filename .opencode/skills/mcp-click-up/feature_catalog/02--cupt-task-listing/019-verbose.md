---
title: "Verbose Output"
description: "cupt list --verbose — add assignee, time estimate, and time tracked columns."
trigger_phrases:
  - "verbose output"
  - "cupt list --verbose"
  - "extended task table"
  - "time estimate columns"
  - "show assignee and time tracked"
---

# Verbose Output

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Expands the default table output with three additional columns: assignee name(s), time estimate (if set), and total time tracked.

---

## 2. HOW IT WORKS

Human-readable only — `--verbose` does not affect `--json` output (JSON always includes all fields).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/utils.py` | CLI | Extended table formatting |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/019-verbose.md`
Related references:
- [018-cap-results.md](018-cap-results.md) — Cap Results
- [020-json-output.md](020-json-output.md) — JSON Output
