---
title: "List Comments"
description: "cupt notes <id> — all comments chronologically with author and timestamp."
---

# List Comments

---

## 1. OVERVIEW

Returns all comments on a task in chronological order. Each entry shows: author name, ISO timestamp, and comment text.

---

## 2. CURRENT REALITY

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
- Feature file path: `05--cupt-notes-comments/02-list-comments.md`
