---
title: "List Comments"
description: "cupt notes <id> — all comments chronologically with author and timestamp."
trigger_phrases:
  - "list comments"
  - "cupt notes"
  - "show task comments"
  - "chronological comment history"
  - "read task notes"
version: 1.0.0.3
---

# List Comments

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns all comments on a task in chronological order. Each entry shows: author name, ISO timestamp, and comment text.

---

## 2. HOW IT WORKS

Use before acting on a task to understand its history and any human instructions left in comments. Output is human-readable. No `--json` flag — parse the structured output if needed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/notes.py` | CLI | Comment listing via ClickUp API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Notes
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `05--cupt-notes-comments/list-comments.md`
Related references:
- [add-comment.md](add-comment.md) — Add Comment
