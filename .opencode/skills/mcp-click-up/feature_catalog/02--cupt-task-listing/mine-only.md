---
title: "Mine Only"
description: "cupt list --mine — restrict to self-assigned tasks."
trigger_phrases:
  - "mine only"
  - "cupt list --mine"
  - "self-assigned tasks"
  - "restrict to my tasks"
  - "override scope to self"
---

# Mine Only

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Explicit equivalent of the default. Most useful when combined with `--all` to override scope back to self.

---

## 2. HOW IT WORKS

Useful in combined invocations where `--all` would otherwise expand scope: `cupt list --all --tag sprint --mine`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Self-assignee scope filter |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/mine-only.md`
Related references:
- [all-tasks.md](all-tasks.md) — All Tasks
- [cap-results.md](cap-results.md) — Cap Results
