---
title: "Verbose Output"
description: "cupt list --verbose — add assignee, time estimate, and time tracked columns."
---

# Verbose Output

---

## 1. OVERVIEW

Expands the default table output with three additional columns: assignee name(s), time estimate (if set), and total time tracked.

---

## 2. CURRENT REALITY

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
- Feature file path: `02--cupt-task-listing/11-verbose.md`
