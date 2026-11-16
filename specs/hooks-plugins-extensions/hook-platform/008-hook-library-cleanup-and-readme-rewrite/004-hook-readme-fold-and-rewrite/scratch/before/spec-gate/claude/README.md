---
title: "Spec Gate Hooks: Claude Adapter Links"
description: "Relative links to the Claude Gate-3 classifier and enforcement adapters in system-spec-kit."
trigger_phrases:
  - "spec gate claude hook"
  - "claude gate 3 classifier"
  - "claude spec gate enforce"
version: 1.0.0.0
---

# Spec Gate Hooks: Claude Adapter Links

---

## 1. OVERVIEW

`claude/` holds the Claude links for the Spec Gate concern. Both files are relative symlinks to the adapters in `system-spec-kit/runtime/hooks/claude/`. Claude wires classify to `UserPromptSubmit` and enforce to `PreToolUse` for `Write`, `Edit` and `Bash` in `.claude/settings.json`. Classify opens the gate and emits nothing on the turn. Enforce delivers the one-time notice at the first mutation and denies only under `SYSTEM_SPEC_GATE_ENFORCE=1`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `spec-gate-classify.mjs` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs`. Runs the shared classifier, opens the gate on a write-intent prompt and records no question on the turn. | Exits 0 and writes nothing on a missing payload or an internal error. |
| `spec-gate-enforce.mjs` | `PreToolUse` on `Write`, `Edit` and `Bash` | Link to `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs`. Returns `permissionDecision: deny` on deny and `additionalContext` with the once-per-session notice on the first in-gate write or edit. | Exits 0 on a missing payload or an internal error. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`](../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs): the shared policy core both adapters call.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the Claude settings file that wires both events.
