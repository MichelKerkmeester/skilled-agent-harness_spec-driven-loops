---
title: "Spec Gate Hooks: Cursor Adapter Links"
description: "Relative links to the Cursor Gate-3 prebind, classifier and enforcement adapters in system-spec-kit."
trigger_phrases:
  - "spec gate cursor hook"
  - "cursor gate 3 prebind"
  - "cursor spec gate enforce"
version: 1.0.0.0
---

# Spec Gate Hooks: Cursor Adapter Links

---

## 1. OVERVIEW

`cursor/` holds the Cursor links for the Spec Gate concern. All three files are relative symlinks to the adapters in `system-spec-kit/runtime/hooks/cursor/`. Cursor wires prebind to `sessionStart`, classify to `beforeSubmitPrompt` and enforce to `preToolUse` in `.cursor/hooks.json`. Prebind exists because Cursor does not deliver its prompt event reliably under the CLI, so session start is where state is established.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `spec-gate-prebind.mjs` | `sessionStart` | Link to `system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs`. Satisfies the gate when `SYSTEM_SPEC_FOLDER` names a valid folder, or opens it when `SYSTEM_SPEC_GATE_ENFORCE=1`. | Writes no state and returns `permission: allow` on a malformed payload, a disabled concern or a child session. |
| `spec-gate-classify.mjs` | `beforeSubmitPrompt` | Link to `system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs`. Runs the shared classifier and opens the gate on a write-intent prompt. | Returns `permission: allow` on a missing payload or an internal error. |
| `spec-gate-enforce.mjs` | `preToolUse` | Link to `system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs`. Maps `Shell` to a shell decision and `Write` to a write. Deny returns `permission: deny` with `user_message` and `agent_message`, warn returns `permission: allow` with `agent_message`. | Returns `permission: allow` on a missing payload or an internal error. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`](../../../skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs): the shared policy core all three adapters call.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the Cursor registration file.
