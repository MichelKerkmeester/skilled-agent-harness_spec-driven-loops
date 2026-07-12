---
title: "Complete with Note"
description: "cupt done <id> --note "<text>" — mark complete and add a comment in one call."
trigger_phrases:
  - "complete with note"
  - "cupt done --note"
  - "mark complete and comment"
  - "completion with handoff note"
  - "done with audit comment"
version: 1.0.0.3
---

# Complete with Note

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Marks the task complete AND appends a comment in a single operation. Preferred over separate `cupt done` + `cupt note` calls for efficiency.

---

## 2. HOW IT WORKS

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
- Feature file path: `cupt-task-completion/complete-with-note.md`
Related references:
- [dry-run.md](../cupt_task_completion/dry_run.md) — Dry-Run Preview
- [auto-note.md](../cupt_task_completion/auto_note.md) — Auto-Note
