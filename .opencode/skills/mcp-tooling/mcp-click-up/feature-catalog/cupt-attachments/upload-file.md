---
title: "Upload File"
description: "cupt attach add <id> <file> — upload a local file as a task attachment."
trigger_phrases:
  - "upload file"
  - "cupt attach add"
  - "attach file to task"
  - "upload attachment"
  - "multipart file upload"
version: 1.0.0.3
---

# Upload File

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Uploads a file from the local filesystem to the specified task as an attachment. The file path must be accessible from the current working directory.

---

## 2. HOW IT WORKS

Files are uploaded via multipart form data to the ClickUp attachments API. Large files may take several seconds. No size limit documented by cupt beyond ClickUp's plan limits.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/attachments.py` | CLI | File upload via ClickUp attachments API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Attachments
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-attachments/upload-file.md`
Related references:
- [list-attachments.md](../../feature-catalog/cupt-attachments/list-attachments.md) — List Attachments
- [download-file.md](../../feature-catalog/cupt-attachments/download-file.md) — Download File
