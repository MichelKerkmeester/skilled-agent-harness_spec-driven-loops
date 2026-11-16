---
title: "Spec Gate Hooks: Devin Adapter Links"
description: "Relative links to the Devin Gate-3 classifier and enforcement adapters in system-spec-kit."
trigger_phrases:
  - "spec gate devin hook"
  - "devin gate 3 classifier"
  - "devin spec gate enforce"
version: 1.0.0.0
---

# Spec Gate Hooks: Devin Adapter Links

---

## 1. OVERVIEW

`devin/` holds the Devin links for the Spec Gate concern. Both files are relative symlinks to the adapters in `system-spec-kit/runtime/hooks/devin/`. Devin wires classify to `UserPromptSubmit` and enforce to `PreToolUse` in `.devin/hooks.v1.json`. The enforce adapter maps `exec` to a shell decision, `edit` to an edit and `write` to a write, and it drops a payload that carries no session id.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `spec-gate-classify.mjs` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs`. Runs the shared classifier, opens the gate on a write-intent prompt and emits nothing on the turn. | Exits 0 and writes nothing on a missing payload, a blank session id or an internal error. |
| `spec-gate-enforce.mjs` | `PreToolUse` on `exec`, `edit` and `write` | Link to `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs`. Returns `permissionDecision: deny` on deny and `additionalContext` on the first in-gate write or edit. | Exits 0 on a missing payload, a blank session id or an internal error. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`](../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs): the shared policy core both adapters call.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration file.
