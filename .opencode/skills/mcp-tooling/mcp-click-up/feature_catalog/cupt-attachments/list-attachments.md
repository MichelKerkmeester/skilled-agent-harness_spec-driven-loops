---
title: "List Attachments"
description: "cupt attach list <id> — all attached files with names, sizes, and upload dates."
trigger_phrases:
  - "list attachments"
  - "cupt attach list"
  - "show task files"
  - "attachment metadata"
  - "list uploaded files"
version: 1.0.0.3
---

# List Attachments

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns metadata for all files attached to the task: filename, file size (bytes), uploader name, and upload timestamp.

---

## 2. HOW IT WORKS

Output is human-readable. Use to discover available attachments before downloading. No `--json` flag on this command.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/attachments.py` | CLI | Attachment metadata listing via ClickUp API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Attachments
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `cupt-attachments/list-attachments.md`
Related references:
- [upload-file.md](upload-file.md) — Upload File
