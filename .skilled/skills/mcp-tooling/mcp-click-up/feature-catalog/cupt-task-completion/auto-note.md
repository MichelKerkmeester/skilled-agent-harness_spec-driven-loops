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

---

## 1. OVERVIEW

Uses Apple Intelligence (via `apple-fm-sdk`, requires a supported macOS system with Apple Intelligence enabled) to draft a suggested completion note from the task description and recent comments, then prompts to accept, edit, or skip it — the note is not appended automatically. Apple Intelligence is the only local AI backend implemented today. Windows Copilot+ and Ollama are listed in the source as future providers.

---

## 2. HOW IT WORKS

Requires local AI configuration (see cupt docs). Falls back to no note if AI is unavailable. Availability depends on the installed cupt version and the local AI setup. Check `cupt --version` and the local AI configuration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/ai.py` | CLI | Local AI note generation on completion |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual playbook | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Completion
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-task-completion/auto-note.md`
Related references:
- [complete-with-note.md](../../feature-catalog/cupt-task-completion/complete-with-note.md) — Complete with Note
