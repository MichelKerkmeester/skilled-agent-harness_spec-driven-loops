---
title: "Mine Only"
description: "cupt list --mine — restrict to self-assigned tasks."
trigger_phrases:
  - "mine only"
  - "cupt list --mine"
  - "self-assigned tasks"
  - "restrict to my tasks"
  - "override scope to self"
version: 1.0.0.3
---

# Mine Only

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Explicit equivalent of the default self-assigned scope. Does NOT override `--all` — if both flags are passed, `--all` wins and the result stays workspace-wide. Use `--mine` only when `--all` is absent.

---

## 2. HOW IT WORKS

`--mine` cannot narrow scope back from `--all` in the same invocation — `cupt list --all --tag sprint --mine` still returns workspace-wide results, because `cupt` unconditionally sets `mine = False` whenever `--all` is present. Run `cupt list --tag sprint` (without `--all`) for the self-assigned equivalent.

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
- Feature file path: `cupt-task-listing/mine-only.md`
Related references:
- [all-tasks.md](all-tasks.md) — All Tasks
- [cap-results.md](cap-results.md) — Cap Results
