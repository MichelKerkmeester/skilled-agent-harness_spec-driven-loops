---
title: "Skill Advisor Hooks: Cursor Adapter Links"
description: "Relative links for the Cursor Skill Advisor path, covering the adapter source and its compiled build in system-spec-kit."
trigger_phrases:
  - "skill advisor cursor hook"
  - "cursor before submit prompt"
  - "cursor advisor adapter"
version: 1.0.0.0
---

# Skill Advisor Hooks: Cursor Adapter Links

---

## 1. OVERVIEW

`cursor/` holds the Cursor links for the Skill Advisor concern. Both files are relative symlinks into `system-spec-kit`, one to the adapter source and one to its compiled build. Cursor registers `beforeSubmitPrompt` from `.cursor/hooks.json` with a 10 s budget. The adapter adds the missing `prompt` field, runs the Claude shim and unwraps the `additionalContext` envelope before it answers Cursor. The source marks delivery as unconfirmed under the tested CLI build.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `user-prompt-submit.ts` | `beforeSubmitPrompt` | Link to `system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts`. The adapter source. Normalizes the Cursor payload, runs `user-prompt-submit.js` with a 2.8 s child budget and emits the unwrapped brief. | Fails open. A missing payload, failed child or invalid output emits no context. |
| `user-prompt-submit.js` | `beforeSubmitPrompt` | Link to `system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js`. The compiled build of the same adapter. | Fails open. The compiled shim relays no context on failure. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../skills/system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts`](../../../skills/system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts): the adapter source behind the link.
- [`../../../skills/system-spec-kit/runtime/hooks/cursor/shared.ts`](../../../skills/system-spec-kit/runtime/hooks/cursor/shared.ts): the payload reader, response emitters and child runner.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the Cursor registration file.
