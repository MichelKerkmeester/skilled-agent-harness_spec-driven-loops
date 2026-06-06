---
title: "Add Comment"
description: "cupt note <id> "<text>" — append a comment to the task."
trigger_phrases:
  - "add comment"
  - "cupt note"
  - "append task comment"
  - "post comment to task"
  - "agent handoff message"
---

# Add Comment

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a new comment to the specified task with the provided text. The comment author is the authenticated cupt user.

---

## 2. HOW IT WORKS

Used for agent handoff messages, progress notes, and audit trails. Text is passed as a positional argument and must be quoted when it contains spaces.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/notes.py` | CLI | Comment creation via ClickUp API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Notes
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `05--cupt-notes-comments/add-comment.md`
Related references:
- [list-comments.md](list-comments.md) — List Comments
