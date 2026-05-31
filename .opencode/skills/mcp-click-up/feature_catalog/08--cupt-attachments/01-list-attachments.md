---
title: "List Attachments"
description: "cupt attach list <id> — all attached files with names, sizes, and upload dates."
---

# List Attachments

---

## 1. OVERVIEW

Returns metadata for all files attached to the task: filename, file size (bytes), uploader name, and upload timestamp.

---

## 2. CURRENT REALITY

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
- Feature file path: `08--cupt-attachments/01-list-attachments.md`
