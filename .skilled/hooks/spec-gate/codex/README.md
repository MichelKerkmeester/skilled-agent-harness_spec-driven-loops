---
title: "Spec Gate Hooks: Codex Adapter Links"
description: "Relative links to the Codex Gate-3 classifier and enforcement adapters in system-spec-kit."
trigger_phrases:
  - "spec gate codex hook"
  - "codex gate 3 classifier"
  - "codex spec gate enforce"
version: 1.0.0.0
---

# Spec Gate Hooks: Codex Adapter Links

---

## 1. OVERVIEW

`codex/` holds the Codex links for the Spec Gate concern. Both files are relative symlinks to the adapters in `system-spec-kit/runtime/hooks/codex/`. Codex wires classify to `UserPromptSubmit` and enforce to `PreToolUse` in `.codex/hooks.json`. The enforce adapter maps `exec` and `bash` to its shell decision, `apply_patch` to a write and `edit` to an edit, and reads patch paths from the patch text when no path field is present.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `spec-gate-classify.mjs` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs`. Runs the shared classifier, opens the gate on a write-intent prompt and emits nothing on the turn. | Exits 0 and writes nothing on a missing payload or an internal error. |
| `spec-gate-enforce.mjs` | `PreToolUse` on `exec`, `bash`, `apply_patch` and `edit` | Link to `system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs`. Returns `permissionDecision: deny` on deny and `additionalContext` on the first in-gate write or edit. | Exits 0 on a missing payload or an internal error. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`](../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs): the shared policy core both adapters call.
- [`../../../../.codex/hooks.json`](../../../../.codex/hooks.json): the Codex registration file.
