---
title: "Auto-Note"
description: "cupt done <id> --auto-note — AI-drafted completion note using local AI."
trigger_phrases:
  - "auto-note"
  - "cupt done --auto-note"
  - "ai-drafted completion note"
  - "automatic handoff note"
  - "local ai note generation"
version: 1.0.0.3
---

# Auto-Note

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Uses Apple Intelligence (via `apple-fm-sdk`, requires a supported macOS system with Apple Intelligence enabled) to draft a suggested completion note from the task description and recent comments, then prompts to accept, edit, or skip it — the note is not appended automatically. No other local AI backend is implemented today; Windows Copilot+ and Ollama are listed in the source as future, not-yet-implemented providers.

---

## 2. HOW IT WORKS

Requires local AI configuration (see cupt docs). Falls back to no note if AI is unavailable. Not available in all cupt installations — check `cupt --version` and local AI setup.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/ai.py` | CLI | Local AI note generation on completion |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Completion
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `cupt-task-completion/auto-note.md`
Related references:
- [complete-with-note.md](../cupt_task_completion/complete_with_note.md) — Complete with Note
