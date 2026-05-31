---
title: "Download File"
description: "cupt attach get <id> <selector> — download an attachment by index or name."
---

# Download File

---

## 1. OVERVIEW

Downloads a task attachment to the current directory. The selector can be a numeric index (from `cupt attach list` output) or a partial filename match.

---

## 2. CURRENT REALITY

Downloaded file is saved with its original name in the current working directory. If multiple files match a partial name, cupt selects the first match.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/attachments.py` | CLI | File download via ClickUp attachments API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Attachments
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `08--cupt-attachments/03-download-file.md`
