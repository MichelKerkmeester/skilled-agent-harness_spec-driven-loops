---
title: "Download File"
description: "cupt attach get <id> <selector> — download an attachment by index or name."
trigger_phrases:
  - "download file"
  - "cupt attach get"
  - "download attachment"
  - "fetch task file"
  - "retrieve attachment by name"
version: 1.0.0.3
---

# Download File

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Downloads a task attachment to the current directory. The selector can be a numeric index (from `cupt attach list` output) or a partial filename match.

---

## 2. HOW IT WORKS

Downloaded file is saved with its original name in the current working directory (or `--output` path, if given). If a partial name matches more than one attachment, cupt raises an error instead of guessing — use the 1-based index from `cupt attach list`, or a substring specific enough to match exactly one file.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/attachments.py` | CLI | File download via ClickUp attachments API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Attachments
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-attachments/download-file.md`
Related references:
- [upload-file.md](../../feature-catalog/cupt-attachments/upload-file.md) — Upload File
