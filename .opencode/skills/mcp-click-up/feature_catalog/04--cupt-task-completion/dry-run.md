---
title: "Dry-Run Preview"
description: "cupt done <id> --dry-run — show resolved status without writing."
trigger_phrases:
  - "dry-run preview"
  - "cupt done --dry-run"
  - "preview completion"
  - "dry run task close"
  - "simulate task completion"
version: 1.0.0.3
---

# Dry-Run Preview

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Performs all status resolution logic but does not make the update API call. Prints the task name, list name, and the resolved closed status that WOULD be applied.

---

## 2. HOW IT WORKS

REQUIRED before any batch completion loop. Cost: one API read (status discovery). Benefit: confirms correct status resolution before irreversible writes. Pattern: `for id in $IDS; do cupt done $id --dry-run; done`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Dry-run completion preview |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Completion
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `04--cupt-task-completion/dry-run.md`
Related references:
- [mark-complete.md](mark-complete.md) — Mark Complete
- [complete-with-note.md](complete-with-note.md) — Complete with Note
