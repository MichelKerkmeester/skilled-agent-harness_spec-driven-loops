---
title: "Complete with Note"
description: "cupt done <id> --note "<text>" — mark complete and add a comment in one call."
---

# Complete with Note

---

## 1. OVERVIEW

Marks the task complete AND appends a comment in a single operation. Preferred over separate `cupt done` + `cupt note` calls for efficiency.

---

## 2. CURRENT REALITY

Used in agent handoff patterns: `cupt done $id --note 'Processed by AI agent. Removed ai_ready, added needs_review.'`. The note appears in task comments with the authenticated user as author.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tasks.py` | CLI | Completion + comment in one call |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Completion
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `04--cupt-task-completion/03-complete-with-note.md`
