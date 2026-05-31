---
title: "Auto-Note"
description: "cupt done <id> --auto-note — AI-drafted completion note using local AI."
---

# Auto-Note

---

## 1. OVERVIEW

When configured, uses a local AI backend (Ollama or system AI) to automatically draft a completion note based on the task description and comments. The note is appended on completion.

---

## 2. CURRENT REALITY

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
- Feature file path: `04--cupt-task-completion/04-auto-note.md`
