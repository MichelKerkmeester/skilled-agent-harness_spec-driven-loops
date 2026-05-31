---
title: "Upload File"
description: "cupt attach add <id> <file> — upload a local file as a task attachment."
---

# Upload File

---

## 1. OVERVIEW

Uploads a file from the local filesystem to the specified task as an attachment. The file path must be accessible from the current working directory.

---

## 2. CURRENT REALITY

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
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Attachments
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `08--cupt-attachments/02-upload-file.md`
